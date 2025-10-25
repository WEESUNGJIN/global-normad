import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// useAuthStore는 프로젝트 전역 상태 관리 스토어에서 가져옵니다.
// 이 파일은 Next.js 환경에서 실행되므로 @/app/store/useAuthStore 경로를 유지합니다.
import { useAuthStore } from "@/app/store/useAuthStore";

/**
 * ✅ API 기본 URL 설정
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sp-globalnomad-api.vercel.app/17-2/";

console.log("✅ API Base URL:", API_BASE_URL);

/**
 * ✅ JWT 토큰 만료 여부 확인 함수
 * @param token 확인할 JWT 액세스 토큰
 * @returns 만료되었으면 true, 아니면 false
 */
const isTokenExpired = (token: string) => {
  try {
    // 토큰의 페이로드(두 번째 부분)를 base64 디코딩
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp(만료 시간)는 초 단위이므로 밀리초로 변환
    const exp = payload.exp * 1000;
    // 현재 시각이 만료 시각보다 크면 true (만료됨)
    return Date.now() > exp;
  } catch (error) {
    console.error("⚠️ Access Token Parsing Failed (isTokenExpired)", error);
    // 파싱 실패 시 만료된 것으로 간주하여 갱신 시도
    return true;
  }
};

/**
 * ✅ Axios 인스턴스 생성
 * - 모든 API 호출에 사용될 기본 인스턴스
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/**
 * ✅ 요청 인터셉터 (Request Interceptor)
 * - 자동 토큰 갱신(Refresh) 로직 포함
 * - 요청이 전송되기 전에 토큰 만료를 확인하고, 만료되었다면 갱신 API를 호출하여 새 토큰을 받아와 적용
 */
apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    // Authorization 헤더가 없는 경우에만 토큰 갱신 로직 실행 (무한 루프 방지)
    // 갱신 요청 자체에는 토큰을 붙이지 않으므로, 갱신 요청은 이 로직을 통과해야 함
    const isRefreshRequest = config.url?.endsWith("/auth/refresh");

    if (accessToken && isTokenExpired(accessToken) && refreshToken && !isRefreshRequest) {
      console.log("⏳ Access Token Expired. Attempting Refresh...");
      try {
        // 토큰 갱신 API 호출
        const refreshResponse = await axios.post(
          `${API_BASE_URL}auth/refresh`,
          { refreshToken }
        );

        accessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", accessToken ?? "");

        // 사용자 정보도 함께 갱신될 경우 AuthStore 업데이트
        if (refreshResponse.data.user) {
          useAuthStore.getState().setUser(refreshResponse.data.user);
        }

        console.log("✅ Token Refresh Successful. New token applied.");
      } catch (error) {
        console.error("❌ Token Refresh Failed. Logging out.", error);
        // 토큰 갱신 실패 시 강제 로그아웃
        useAuthStore.getState().logout();
        // 갱신 실패 시 요청을 중단하고 에러 발생
        return Promise.reject(new axios.Cancel("Token refresh failed, request aborted."));
      }
    }

    // 새롭게 갱신되었거나 만료되지 않은 accessToken을 헤더에 추가
    if (accessToken && !isRefreshRequest) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ 응답 인터셉터 (Response Interceptor)
 * - 401(인증 만료) 응답을 받았을 때 토큰 갱신 및 재시도(Retry) 로직 포함
 * - 성공 시 응답 데이터만 반환
 */
apiClient.interceptors.response.use(
  // 1. 요청 성공 시: 응답 데이터만 반환 (기존 api.ts 로직)
  (response: AxiosResponse) => response.data,
  
  // 2. 요청 실패 시: 에러 핸들링 및 401 재시도 로직
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러이고, 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정
      console.log("⚠️ 401 Received. Attempting Token Refresh and Request Retry...");
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        // 토큰 갱신 API 호출
        const refreshResponse = await axios.post(
          `${API_BASE_URL}auth/refresh`,
          { refreshToken }
        );
        
        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // 사용자 정보 업데이트
        if (refreshResponse.data.user) {
          useAuthStore.getState().setUser(refreshResponse.data.user);
        }

        // 새 토큰으로 요청 헤더 업데이트 후 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        console.log("✅ Token Refresh & Retry Successful.");
        // 재시도된 요청을 반환 (이 요청의 응답은 다시 이 인터셉터를 거치게 되며, 성공 시 data가 반환됨)
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.error("❌ Token Refresh Failed during 401 retry. Logging out.", refreshError);
        // 갱신 실패 시 강제 로그아웃
        useAuthStore.getState().logout();
        // 로그아웃 후 원래의 401 에러 반환
        return Promise.reject(error);
      }
    }
    
    // 재시도 대상이 아닌 401 에러이거나, 다른 종류의 에러인 경우
    if (error.response?.status === 401) {
      console.warn("⚠️ Authentication expired or unauthorized. Please re-login.");
    }

    // 그 외 모든 에러는 Promise.reject로 반환
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

/**
 * ✅ 타입 안전한 CRUD wrapper
 * - <T> : 응답 데이터 타입
 * - <B> : 요청 body 타입 (POST, PATCH에서 사용)
 * - AxiosResponse<T> 대신 T 자체를 반환
 */
const api = {
  /** GET 요청 */
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.get(url, config),

  /** POST 요청 */
  post: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.post(url, body, config),

  /** PATCH 요청 */
  patch: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.patch(url, body, config),

  /** DELETE 요청 */
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.delete(url, config),
};

export default api;

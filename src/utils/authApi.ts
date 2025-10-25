// src/utils/authApi.ts

{
  /*테스트용 컴포넌트 추후 api.ts에 병합 */
}

import axios from "axios";
import { useAuthStore } from "@/app/store/useAuthStore";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp; // 현재 시각 > exp 일시 만료
  } catch (error) {
    console.error("토큰 파싱 실패", error);
    return true;
  }
};

authApi.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("accesToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken && isTokenExpired(accessToken)) {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken },
      );

      accessToken = data.accessToken;
      localStorage.setItem("accessToken", accessToken ?? "");

      if (data.user) {
        useAuthStore.getState().setUser(data.user);
      }
    } catch (error) {
      console.error("토큰 갱신 실패", error);
      useAuthStore.getState().logout();
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );
        localStorage.setItem("accessToken", data.accessToken);

        if (data.user) {
          useAuthStore.getState().setUser(data.user);
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return authApi(originalRequest);
      } catch (error) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export default authApi;

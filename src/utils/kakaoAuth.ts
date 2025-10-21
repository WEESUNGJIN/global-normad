// src/utils/kakaoAuth.ts

export const redirectToKakaoAuth = (type: "signup" | "login") => {
  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  if (!REST_API_KEY) {
    console.error("Kakao REST API KEY가 없습니다");
    return;
  }

  const REDIRECT_URI =
    process.env.NODE_ENV === "production"
      ? type === "login" //환경 구분
        ? "https://inmyday.vercel.app/oauth/kakao-login"
        : "https://inmyday.vercel.app/oauth/kakao"
      : type === "login" // 로그인/회원가입 구분
        ? "http://localhost:3000/oauth/kakao-login"
        : "http://localhost:3000/oauth/kakao";

  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  window.location.href = kakaoAuthURL;
};

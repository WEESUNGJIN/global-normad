// src/utils/kakaoAuth.ts

export const redirectToKakaoAuth = () => {
  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const REDIRECT_URI =
    process.env.NODE_ENV === "production"
      ? "https://inmyday.vercel.app/oauth/kakao"
      : "http://localhost:3000/oauth/kakao";

  if (!REST_API_KEY) {
    console.error("Kakao REST API KEY가 없습니다");
    return;
  }

  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  window.location.href = kakaoAuthURL;
};

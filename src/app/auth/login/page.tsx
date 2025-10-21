// src/app/auth/login/page.tsx
"use client";

import LoginForm from "./components/LoginForm";
import { redirectToKakaoAuth } from "@/utils/kakaoAuth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[640px]">
        <p className="mb-8">로고</p>
        <LoginForm />

        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <div className="mt-8">
          <button
            onClick={() => redirectToKakaoAuth("login")}
            className="border rounded-xl p-3 w-full"
          >
            카카오 로그인
          </button>
        </div>

        <div className="mt-8 text-center">
          <span className="text-gray-400">
            회원이 아니신가요?{" "}
            <a href="/auth/signup" className="border-b">
              회원가입하기
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

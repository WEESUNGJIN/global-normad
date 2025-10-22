// src/app/auth/login/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/LoginForm";
import { redirectToKakaoAuth } from "@/utils/kakaoAuth";
import logoGnb from "@/assets/img/logo_gnb.svg";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-[640px] sm:max-w-[480px] md:max-w-[640px]">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src={logoGnb}
              alt="inmyday 로고"
              className="w-60 sm:w-80 md:w-90 h-auto mb-3"
              priority
            />
          </Link>
        </div>

        <div className="w-full space-y-4">
          <LoginForm />
        </div>

        <div className="flex items-center my-6 sm:my-8">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <div className="mt-8">
          <button
            onClick={() => redirectToKakaoAuth("login")}
            className="w-full border rounded-xl p-3 sm:p-4 text-sm sm:text-base"
          >
            카카오 로그인
          </button>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <span className="text-gray-400 text-sm sm:text-base">
            회원이 아니신가요?{" "}
            <Link
              href="/auth/signup"
              className="border-b hover:text-blue-500 transition-colors"
            >
              회원가입하기
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

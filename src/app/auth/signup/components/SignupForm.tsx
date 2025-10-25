// src/app/auth/signup/components/SignupForm.tsx
"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import PasswordInput from "@/app/mypage/profile/components/PasswordInput";
import KakaoIcon from "@/assets/icon/kakaoicon.svg";
import Image from "next/image";

import { useSignup } from "../hooks/useSignup";
import { isValidEmail } from "../utils/validation";
import { redirectToKakaoAuth } from "@/utils/kakaoAuth";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const { handleSignup } = useSignup();

  const isValid =
    isValidEmail(email) &&
    nickname.trim().length > 0 &&
    password === checkPassword &&
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    handleSignup(email, nickname, password, setError, setSuccess);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4 sm:gap-6"
      >
        <Input
          label="이메일"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          status={!isValidEmail(email) && email ? "error" : "default"}
          helpText={
            !isValidEmail(email) && email
              ? "올바른 이메일을 입력해주세요"
              : undefined
          }
        />
        <Input
          label="닉네임"
          placeholder="닉네임을 입력해 주세요."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <PasswordInput
          password={password}
          checkPassword={checkPassword}
          setPassword={setPassword}
          setCheckPassword={setCheckPassword}
          error={error}
        />

        <Button
          type="submit"
          size="lg"
          label="회원가입"
          fullWidth
          disabled={!isValid}
          variant={!isValid ? "secondary" : "primary"}
        />
      </form>

      <div className="flex items-center my-6 sm:my-8">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">
          SNS 계정으로 회원가입하기
        </span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <Button
        type="button"
        onClick={() => redirectToKakaoAuth("signup")}
        label={
          <div className="flex items-center justify-center gap-2">
            <Image src={KakaoIcon} alt="kakao" width={20} height={20} />
            <span className="text-black">카카오 회원가입</span>
          </div>
        }
        fullWidth
        className="!bg-[#FEE500] hover:!bg-[#E5C100] text-sm sm:text-base p-6"
      />

      <div className="text-center mt-6 sm:mt-8">
        <p className="text-gray-500 text-sm sm:text-base">
          회원이신가요?{" "}
          <a
            href="/auth/login"
            className="border-b hover:text-blue-500 transition-colors"
          >
            로그인하기
          </a>
        </p>
      </div>

      <Modal
        open={!!error}
        title="회원가입 실패"
        onClose={() => setError("")}
        onConfirm={() => setError("")}
        confirmText="확인"
        showCancel={false}
      >
        <p>{error}</p>
      </Modal>

      <Modal
        open={!!success}
        title="회원가입 완료"
        onClose={() => {
          setSuccess("");
          router.push("/");
        }}
        onConfirm={() => {
          setSuccess("");
          router.push("/");
        }}
        confirmText="확인"
        showCancel={false}
      >
        <p>
          회원가입이 완료되었습니다.
          <br />
          환영합니다!
        </p>
      </Modal>
    </>
  );
}

//env.local REST API Key 넣어야함

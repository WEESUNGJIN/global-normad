// src/app/auth/signup/components/SignupForm.tsx
"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useSignup } from "../hooks/useSignup";
import { isValidEmail, isValidSignup } from "../utils/validation";
import { redirectToKakaoAuth } from "@/utils/kakaoAuth";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const { handleSignup } = useSignup();
  const isValid = isValidSignup(email, nickname, password, checkPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    handleSignup(email, nickname, password);
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
        <Input
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
          showPasswordToggle
          status={
            password.length > 0 && password.length < 8 ? "error" : "default"
          }
          helpText={
            password.length > 0 && password.length < 8
              ? "8자 이상 입력해 주세요."
              : undefined
          }
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더 입력해주세요."
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
          showPasswordToggle
          status={
            checkPassword && checkPassword !== password ? "error" : "default"
          }
          helpText={
            checkPassword && checkPassword !== password
              ? "비밀번호를 확인해 주세요."
              : undefined
          }
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
        label="카카오 회원가입"
        fullWidth
        variant="secondary"
        className="text-sm sm:text-base"
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
    </>
  );
}

//env.local REST API Key 넣어야함

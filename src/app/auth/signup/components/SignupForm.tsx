// src/app/auth/signup/components/SignupForm.tsx
"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useSignup } from "../hooks/useSignup";
import { isValidEmail, isValidSignup } from "../utils/validation";

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
      <form onSubmit={handleSubmit}>
        <Input
          label="이메일"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-8"
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
          className="mb-8"
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value.trimStart())}
          showPasswordToggle
          className="mb-8"
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
          className="mb-8"
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
      <div className="flex items-center my-8">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">
          SNS 계정으로 회원가입하기
        </span>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      <button
        className="border rounded-xl p-3 w-full"
        type="button"
        onClick={() => {
          const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
          const REDIRECT_URI = "http://localhost:3000/oauth/kakao";
          const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
          window.location.href = kakaoAuthURL;
        }}
      >
        카카오 회원가입
      </button>
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm ">
          회원이신가요?{" "}
          <a href="/auth/login" className="underline">
            로그인하기
          </a>
        </p>
      </div>
    </>
  );
}

//env.local REST API Key 넣어야함

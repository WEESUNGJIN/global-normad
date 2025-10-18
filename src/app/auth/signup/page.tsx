// src/app/auth/signup/page.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import api from "@/utils/api";
import axios from "axios";

const wrapper = "min-h-screen flex justify-center items-center";

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

interface SignupResponse {
  message: string;
}

const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  return api.post<SignupResponse, SignupRequest>("/users", data);
};

// 이메일 유효성 검사
function isValidEmail(email: string): boolean {
  const effective = /^[^\s@]+@[^\s@]+\.(com|co.kr)$/i;
  return effective.test(email);
}

export default function Singup() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const router = useRouter();

  const isEamilValid = isValidEmail(email); // 검사

  const isValid =
    isEamilValid &&
    nickname.trim() !== "" &&
    password.trim().length >= 8 &&
    password === checkPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const res = await signup({ email, nickname, password });
      console.log("회원가입 성공", res.message);
      router.push("/auth/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message as string | undefined;

        if (status === 409) {
          alert(message ?? "이미 가입된 이메일입니다!");
          return;
        }

        alert(message ?? "회원가입중 오류 발생"); //409외의 에러 처리
      }
    }
  };

  return (
    <div className={wrapper}>
      <div className="w-[640px]">
        <p className="mb-12 mt-12">이미지</p>
        {/* <img src={logoAuth} alt="로고" width={120} height={40} /> */}
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
            value={nickname}
            placeholder="닉네임을 입력해 주세요."
            onChange={(e) => setNickname(e.target.value)}
            className="mb-8"
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="8자 이상 입력해 주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            className="mb-8"
            status={
              password.length > 0 && password.trim().length < 8
                ? "error"
                : "default"
            }
            helpText={
              password.length > 0 && password.trim().length < 8
                ? "8자 이상 입력해 주세요."
                : undefined
            }
          />
          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 한 번 더 입력해 주세요."
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
      </div>
    </div>
  );
}

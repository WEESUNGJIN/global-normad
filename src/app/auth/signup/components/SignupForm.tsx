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
  const isValid = isValidSignup(email, password, nickname, checkPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    handleSignup(email, password, nickname);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="이메일"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-8"
        status={!isValid && email ? "error" : "default"}
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
  );
}

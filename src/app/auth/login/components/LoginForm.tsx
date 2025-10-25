// src/app/auth/login/components/LoginForm.tsx

"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useLogin } from "../hooks/useLogin";
import { isValidLogin, isValidEmail } from "../utils/validation";
import Modal from "@/components/Modal";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { handleLogin } = useLogin();

  const isValid = isValidLogin(email, password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    handleLogin(email, password, setError);
  };

  return (
    <>
      <form>
        <Input
          label="이메일"
          placeholder="이메일을 입력해 주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          status={!isValidEmail(email) && email ? "error" : "default"}
          helpText={
            !isValidEmail(email) && email
              ? "이메일 형식으로 작성해 주세요."
              : undefined
          }
          className="mb-8"
        />
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-8"
          showPasswordToggle
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
        <Button
          onClick={handleSubmit}
          type="submit"
          label="로그인"
          size="lg"
          fullWidth
        />
      </form>

      <Modal
        open={!!error}
        title="로그인 실패"
        onClose={() => setError("")}
        onConfirm={() => setError("")}
        confirmText="확인"
        showCancel={false}
      >
        <p className="text-gray-600 mt-2">{error}</p>
      </Modal>
    </>
  );
}

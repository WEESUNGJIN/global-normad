"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import api from "@/utils/api";
import NicknameInput from "./NicknameInput";
import PasswordInput from "./PasswordInput";
import SaveButton from "./SaveButton";

export default function ProfileForm() {
  const { user, setUser } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const email = user?.email || "";

  const isValidPassword = (pw: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nickname.trim()) return setError("닉네임을 입력해주세요.");
    if (password && !isValidPassword(password))
      return setError("영문과 숫자를 포함해서 8자 이상 입력해주세요.");
    if (password !== checkPassword)
      return setError("비밀번호가 일치하지 않습니다.");

    try {
      await api.patch("/users/me", {
        nickname,
        // profileImageUrl: uploadedImageUrl,
        ...(password && { newPassword: password }),
      });

      setUser({ ...user!, nickname });
      setSuccess("프로필이 수정되었습니다!");
      setPassword("");
      setCheckPassword("");
    } catch (error) {
      console.error(error);
      setError("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <NicknameInput
        nickname={nickname}
        email={email}
        setNickname={setNickname}
        error={error}
      />
      <PasswordInput
        password={password}
        checkPassword={checkPassword}
        setPassword={setPassword}
        setCheckPassword={setCheckPassword}
        error={error}
      />
      <SaveButton success={success} />
    </form>
  );
}

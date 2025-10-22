// src/app/mypage/profile/page.tsx
"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuthStore } from "@/app/store/useAuthStore";
import api from "@/utils/api";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const email = user?.email || "";

  const isValidPassword = (pw: string): boolean =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    if (password) {
      if (!isValidPassword(password)) {
        setError("영문과 숫자를 포함해서 8자 이상 입력해주세요.");
        return;
      }
    }

    if (password !== checkPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await api.patch("/users/me", {
        nickname,
        ...(password && { password }),
      });
      setUser({
        ...user!,
        nickname,
      });
      setSuccess("프로필이 수정되었습니다!");
      setPassword("");
      setCheckPassword("");
    } catch (error) {
      console.error(error);
      setError("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="lg:w-[640px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={user?.nickname || "닉네임을 입력하세요"}
          status={error.includes("닉네임") ? "error" : "default"}
          helpText={error.includes("닉네임") ? error : ""}
        />
        <Input label="이메일" value={email} disabled placeholder={email} />
        <Input
          label="새 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
          placeholder="8자 이상 입력해주세요."
          status={error.includes("비밀번호") ? "error" : "default"}
          helpText={
            error.includes("비밀번호")
              ? "영문과 숫자를 포함해서 8자 이상 입력해주세요."
              : ""
          }
        />
        <Input
          label="비밀번호 확인"
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
          showPasswordToggle
          placeholder="비밀번호를 한 번 더 입력해주세요."
          status={
            password && checkPassword && password !== checkPassword
              ? "error"
              : "default"
          }
          helpText={
            password && checkPassword && password !== checkPassword
              ? "비밀번호가 일치하지 않습니다."
              : ""
          }
        />

        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="flex justify-center mt-10">
          <Button type="submit" label="저장하기" className="py-3 px-10" />
        </div>
      </form>
    </section>
  );
}

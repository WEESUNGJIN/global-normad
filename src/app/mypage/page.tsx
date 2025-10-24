// src/app/mypage/page.tsx
"use client";

import ProfileForm from "./profile/components/ProfileForm";

export default function ProfilePage() {
  return (
    <section className="lg:w-[640px]">
      <header className="lg:w-[640px] mb-6">
        <h1 className="typo-18-b">내 정보</h1>
        <p className="mt-1 text-sm text-gray-500">
          닉네임과 비밀번호를 수정하실 수 있습니다.
        </p>
      </header>
      <ProfileForm />
    </section>
  );
}

//TODO: 새로고침 로그인 유지

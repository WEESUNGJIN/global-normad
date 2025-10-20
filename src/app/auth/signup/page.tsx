// src/app/auth/signup/page.tsx
"use client";

import SignupForm from "./components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[640px]">
        <p className="mb-12 mt-12">이미지</p>
        <SignupForm />
      </div>
    </div>
  );
}

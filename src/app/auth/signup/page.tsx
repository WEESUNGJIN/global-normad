// src/app/auth/signup/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import SignupForm from "./components/SignupForm";
import logoGnb from "@/assets/img/logo_gnb.svg";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-[640px]">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src={logoGnb}
              alt="inmyday 로고"
              className="w-60 sm:w-80 md:w-90 h-auto mb-3"
              priority
            />
          </Link>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

// src/app/auth/signup/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import SignupForm from "./components/SignupForm";
import logoGnb from "@/assets/img/logo_gnb.svg";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[640px]">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src={logoGnb}
              alt="inmyday 로고"
              width={320}
              height={48}
              priority
            />
          </Link>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

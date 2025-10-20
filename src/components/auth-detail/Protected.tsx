// src/components/auth-detail/Protected.tsx

"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function Protected({ children }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    } else {
      setChecked(true);
    }
  }, [user, router]);

  if (!checked) return null;
  return <>{children}</>;
}

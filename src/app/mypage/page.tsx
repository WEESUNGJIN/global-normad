// src/app/mypage/page.tsx
import { redirect } from "next/navigation";

export default function Mypage() {
  redirect("/mypage/profile");
}

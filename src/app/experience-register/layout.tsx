import React from "react";
import GNB from "@/components/GNB";
import Footer from "@/components/Footer";

export default function ExperienceRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* TODO: 공용 레이아웃 적용 후 GNB 제거 예정 */}
      <GNB isLoggedIn unread={3} />
      {children}
      {/* TODO: 공용 레이아웃 적용 후 Footer 제거 예정 */}
      <Footer />
    </div>
  );
}

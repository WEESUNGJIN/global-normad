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
      <GNB isLoggedIn unread={3} />
      {children}
      <Footer />
    </div>
  );
}

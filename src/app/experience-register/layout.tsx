import React from "react";
import GNB from "@/components/GNB";
import Footer from "@/components/Footer";
import Protected from "@/components/auth-detail/Protected";

export default function ExperienceRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <div>
        <GNB isLoggedIn unread={3} />
        {children}
        <Footer />
      </div>
    </Protected>
  );
}

/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from "next";
import "../styles/globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import AuthRestore from "@/components/auth-detail/AuthRestore";

export const metadata: Metadata = {
  title: "In My Day",
  description: "Next.js App Router setup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          <AuthRestore />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}

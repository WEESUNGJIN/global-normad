/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from "next";
import "../styles/globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Global-Nomad",
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
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}

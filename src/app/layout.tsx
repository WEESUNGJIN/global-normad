/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from "next";
import "../styles/globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import AuthRestore from "@/components/auth-detail/AuthRestore";

export const metadata: Metadata = {
  title: "In My Day",
  description: "Next.js App Router setup",
  // 💡 파비콘 자동 감지를 위해 'icons' 설정을 제거합니다.
  // 로고 파일 이름을 'icon.png' 또는 'favicon.ico'로 변경하여
  // 'app' 디렉토리에 넣어주세요.
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

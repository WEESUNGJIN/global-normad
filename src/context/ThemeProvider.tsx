// src/context/ThemeProvider.tsx
"use client";
import React, { createContext, useContext, useEffect, useMemo, useLayoutEffect, useState } from "react";
import { THEME_STORAGE_KEY, getSystemTheme, applyTheme } from "./theme-utils";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Resolved;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export default function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  const [systemTheme, setSystemTheme] = useState<Resolved>(() => getSystemTheme());

  // OS 테마 변경 감지
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemTheme(mql.matches ? "dark" : "light");
    handler();
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  // 초기 로드: 저장값 복구 + 마운트 플래그 (첫 페인트 전 동기 반영)
  useLayoutEffect(() => {
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? null;
    if (stored) setTheme(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // 실제 적용될 테마 계산
  const resolvedTheme = useMemo<Resolved>(() => (theme === "system" ? systemTheme : theme), [theme, systemTheme]);

  // DOM 적용 + 사용자 설정 저장
  useEffect(() => {
    if (!mounted) return;
    applyTheme(resolvedTheme);                       // 실제 DOM에는 resolvedTheme 적용
    localStorage.setItem(THEME_STORAGE_KEY, theme);  // 사용자는 'system' 같은 선호값 저장
  }, [resolvedTheme, theme, mounted]);

  // Hydration 깜빡임 방지
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// src/context/theme-utils.ts (새 파일)
export const THEME_STORAGE_KEY = "theme";

export function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: "light" | "dark" | "system") {
  const root = document.documentElement;
  
  if (theme === "system") {
    const systemTheme = getSystemTheme();
    root.classList.toggle("dark", systemTheme === "dark");
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}
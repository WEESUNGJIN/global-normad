/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.stories.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // === Brand ===
        primary: {
          100: "#E5F3FF",
          500: "#3D9EF2",
          // 👇 text-primary-600 호환용 (500보다 약간 어둡게)
          600: "#2F86D1",
          DEFAULT: "#3D9EF2",
        },

        // === Gray scale ===
        gray: {
          25: "#F8F8F8",
          50: "#EDEEF2",
          100: "#E0E0E5",
          200: "#C6C8CF",
          300: "#B3B4BC",
          400: "#9FA0A7",
          500: "#84858C",
          600: "#707177",
          700: "#5D5D61",
          800: "#49494C",
          900: "#323236",
          950: "#1F1F22",
        },

        // === Red ===
        red: {
          500: "#FF2727",
          DEFAULT: "#FF2727",
        },

        // === Common ===
        white: "#FFFFFF",
        black: "#000000",

        // === 기존 토큰 유지 ===
        "text-primary": "var(--color-text-primary, #111827)",
        "text-secondary": "var(--color-text-secondary, #6B7280)",
        "bg-surface": "var(--color-surface, #FFFFFF)",
        "bg-default": "var(--color-background, #FFFFFF)",
        "border-default": "var(--color-border, #E5E7EB)",
      },

      fontSize: {
        "11m": ["11px", "1.36"],
        "11b": ["11px", "1.36"],
        "12m": ["12px", "1.33"],
        "12b": ["12px", "1.33"],
        "13m": ["13px", "1.3"],
        "13b": ["13px", "1.3"],
        "14m": ["14px", "1.28"],
        "14b": ["14px", "1.28"],
        "16m": ["16px", "1.5"],
        "16b": ["16px", "1.5"],
        "18m": ["18px", "1.5"],
        "18b": ["18px", "1.5"],
        "20m": ["20px", "1.4"],
        "20b": ["20px", "1.4"],
        "24m": ["24px", "1.25"],
        "24b": ["24px", "1.25"],
        "32m": ["32px", "1.25"],
        "32b": ["32px", "1.25"],
        "14-body-m": ["14px", "1.5"],
        "16-body-m": ["16px", "1.5"],
        "18-body-b": ["18px", "1.4"],
        "20-body-b": ["20px", "1.6"],
      },

      spacing: {
        82: "20.5rem",
        100: "25rem",
      },

      boxShadow: {
        searchbar: "0 4px 24px rgba(0, 0, 0, 0.09)",
      },
    },
  },
  plugins: [],
};

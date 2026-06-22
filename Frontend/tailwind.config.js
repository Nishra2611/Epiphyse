/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FB",
        surface: "#FFFFFF",
        primary: "#1A3557",
        accent: "#0D9488",
        textPrimary: "#111827",
        textMuted: "#6B7280",
        borderSoft: "#E5E7EB",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        clinical: "0 1px 2px rgba(17, 24, 39, 0.05)",
      },
    },
  },
  plugins: [],
};

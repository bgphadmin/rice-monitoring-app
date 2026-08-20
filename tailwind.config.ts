import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // 👈 important for next-themes
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bgGreen: "var(--bg-green)",
        bgBlue: "var(--bg-blue)",
        bgRed: "var(--bg-red)",
        bgSlate: "var(--bg-slate)",
            card: "var(--card)",
            muted: "var(--muted)",
            accent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
export default config;

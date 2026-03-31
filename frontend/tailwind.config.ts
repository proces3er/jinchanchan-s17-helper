import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f5d565",
        "primary-dark": "#d9b43a",
        background: "#050816",
        "background-elevated": "#0b1020",
        accent: "#4ade80",
      },
      boxShadow: {
        "soft-gold": "0 10px 40px rgba(245, 213, 101, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

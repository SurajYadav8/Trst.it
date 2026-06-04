import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dde1e9",
          300: "#bcc3d0",
          400: "#8a93a6",
          500: "#5b6478",
          600: "#3f4757",
          700: "#2c323f",
          800: "#1c2029",
          900: "#0f1218",
        },
        // Fhenix-inspired primary: teal / blue-green (confidential computing).
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        // Fhenix-inspired signature accent: electric cyan, used for glow + the "*".
        accent: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        // Deep near-black surfaces for the dark landing experience.
        night: {
          950: "#070809",
          900: "#0a0c0e",
          800: "#101316",
          700: "#171b20",
          600: "#21262d",
        },
        success: {
          50: "#ecfdf5",
          500: "#10b981",
          700: "#047857",
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444",
          700: "#b91c1c",
        },
        warn: {
          50: "#fffbeb",
          500: "#f59e0b",
          700: "#b45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 18 24 / 0.04), 0 1px 3px 0 rgb(15 18 24 / 0.06)",
        soft: "0 4px 24px -8px rgb(15 18 24 / 0.08)",
        glow: "0 0 0 1px rgb(34 211 238 / 0.14), 0 0 40px -8px rgb(34 211 238 / 0.45)",
        "glow-sm": "0 0 0 1px rgb(34 211 238 / 0.12), 0 0 18px -6px rgb(34 211 238 / 0.4)",
      },
      keyframes: {
        "grid-drift": {
          "0%": { backgroundPosition: "0px 0px" },
          "100%": { backgroundPosition: "0px 48px" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "grid-drift": "grid-drift 24s linear infinite",
        "pulse-glow": "pulse-glow 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

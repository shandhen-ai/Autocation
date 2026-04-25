import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-google-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        /* ── Luxury Gold Palette ───────────────────────────────────── */
        gold: {
          300: "#F0D98A",  /* Bright Gold — hover / highlight */
          400: "#D4A038",  /* Primary Gold — base brand color */
          500: "#B8860F",  /* Mid-gold — secondary accent */
          600: "#9E7422",  /* Deep Bronze — borders / shadows */
          700: "#7A5920",  /* Dark bronze */
          800: "#5A4219",  /* Darker bronze */
          900: "#2A200A",  /* Very Dark Bronze — active states */
        },
        "accent-red": "#E60000",
      },
      boxShadow: {
        /* ── Gold glows ───────────────────────────────────────────── */
        "glow-gold-sm": "0 0 12px 2px rgba(212,160,56,0.25)",
        "glow-gold-md": "0 0 20px 4px rgba(212,160,56,0.20), 0 0 40px 8px rgba(212,160,56,0.10)",
        "glow-gold-lg": "0 0 24px 6px rgba(235,203,113,0.30), 0 0 48px 12px rgba(212,160,56,0.15)",
      },
      ringColor: {
        DEFAULT: "#D4A038",
      },
      ringWidth: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
};
export default config;

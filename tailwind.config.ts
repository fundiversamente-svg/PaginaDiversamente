import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme mapped colors with CSS variables or direct palette
        brand: {
          terracotta: "#8c5e45",
          "terracotta-light": "#f4ba9c",
          "terracotta-dark": "#4b2712",
          sage: "#586244",
          "sage-light": "#c0cba7",
          "sage-bg": "#dce7c1",
          gold: "#e9c349",
          "gold-deep": "#735c00",
          cream: "#fdfcfb",
          sand: "#f5f3f0",
          charcoal: "#131412",
          "charcoal-light": "#1b1c1a",
          "charcoal-card": "#1f201e",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          container: "var(--color-primary-container)",
          "on-container": "var(--color-on-primary-container)",
          foreground: "var(--color-on-primary)",
          fixed: "#ffdbca",
          "fixed-dim": "#f4ba9c",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
          container: "var(--color-secondary-container)",
          "on-container": "var(--color-on-secondary-container)",
          foreground: "var(--color-on-secondary)",
          fixed: "#dce7c1",
          "fixed-dim": "#c0cba7",
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
          container: "var(--color-tertiary-container)",
          "on-container": "var(--color-on-tertiary-container)",
          foreground: "var(--color-on-tertiary)",
          fixed: "#ffe088",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
          bright: "var(--color-surface-bright)",
          variant: "var(--color-surface-variant)",
          lowest: "var(--color-surface-container-lowest)",
          low: "var(--color-surface-container-low)",
          container: "var(--color-surface-container)",
          high: "var(--color-surface-container-high)",
          highest: "var(--color-surface-container-highest)",
        },
        on: {
          surface: "var(--color-on-surface)",
          "surface-variant": "var(--color-on-surface-variant)",
          background: "var(--color-on-background)",
        },
        border: {
          DEFAULT: "var(--color-outline-variant)",
          outline: "var(--color-outline)",
        },
      },
      fontFamily: {
        headline: ["var(--font-caslon)", "Libre Caslon Text", "Georgia", "serif"],
        body: ["var(--font-atkinson)", "Atkinson Hyperlegible Next", "Atkinson Hyperlegible", "sans-serif"],
        label: ["var(--font-atkinson)", "Atkinson Hyperlegible Next", "sans-serif"],
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "64px",
        gutter: "24px",
        xs: "4px",
        base: "8px",
        sm: "12px",
        md: "24px",
        lg: "48px",
        xl: "80px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        "ambient-1": "0px 4px 20px rgba(62, 47, 40, 0.06)",
        "ambient-2": "0px 12px 32px rgba(140, 94, 69, 0.12)",
        "ambient-glow": "0 0 40px -10px rgba(244, 186, 156, 0.25)",
      },
      keyframes: {
        morph: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        morph: "morph 8s ease-in-out infinite",
        fadeIn: "fadeIn 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

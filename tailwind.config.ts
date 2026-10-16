import type { Config } from "tailwindcss";

/**
 * ELORA design tokens.
 * Warm ivory grounds, charcoal ink, muted olive and taupe secondaries,
 * and a restrained gold accent reserved for small moments.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F5EF",
        cream: "#F0EAE0",
        sand: "#E5DCCD",
        taupe: { DEFAULT: "#A69A89", dark: "#8A7E6D" },
        stone: "#6A645B",
        ink: { DEFAULT: "#1E1D1A", soft: "#2E2C28" },
        olive: { DEFAULT: "#545B3B", dark: "#3C4129", light: "#8C9170" },
        gold: "#B48C55",
        line: "#DDD5C8",
        danger: "#9B3D2E",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Jost", "system-ui", "sans-serif"],
      },
      fontSize: {
        eyebrow: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.22em" }],
        "display-sm": ["2.5rem", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        display: ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-xl": ["clamp(3.5rem, 10vw, 9.5rem)", { lineHeight: "0.88", letterSpacing: "-0.025em" }],
      },
      maxWidth: { site: "1440px" },
      transitionTimingFunction: { editorial: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in-right": { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
        "slide-in-left": { from: { transform: "translateX(-100%)" }, to: { transform: "none" } },
        "slide-down": { from: { opacity: "0", transform: "translateY(-12px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.3s ease-out both",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-left": "slide-in-left 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-down": "slide-down 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;

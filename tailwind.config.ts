import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf3",
          100: "#d6f7e2",
          200: "#b0edc9",
          300: "#7bdda9",
          400: "#43c586",
          500: "#1eaa6c",
          600: "#128a57",
          700: "#106e48",
          800: "#11573b",
          900: "#0f4832",
          950: "#06281c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;

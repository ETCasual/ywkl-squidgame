import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zekton: ["digital-7", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

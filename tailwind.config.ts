import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E62E05", // E62E05
        secondary: "#FFE6D5", // FFE6D5
        darkBlue: "#344054", // 344054
        blueGray: "#475467", // 475467
        darkGray: "#101828", // 101828
      },
    },
  },
  plugins: [],
};
export default config;

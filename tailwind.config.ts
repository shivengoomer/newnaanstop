import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Ensure dark mode is enabled
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#df6853",
        grey: "#363636", // Lighter grey
        // Darker black for dark mode
        black: "#0A0A0A", // Darker shade of black
        "dark-background": "#0A0A0A", // Even darker background for dark mode
      },
      spacing: {
        "60%": "60%",
        "70%": "70%",
      },
      letterSpacing: {
        widest: "0.515em",
      },
      borderRadius: {
        Newsletter: "30px 400px 30px 30px",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      lg: "1920px",
      md: "640px",
      sm: "375px",
    },
    extend: {
      colors: {
        primary: "#929EEA",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      scale: {
        101: "1.015",
      },
      width: {
        128: "32rem",
        192: "48rem",
        content: "fit-content",
      },
      height: {
        content: "fit-content",
      },
      borderRadius: {
        circle: "100%",
      },
      zIndex: {
        back: "-1",
      },
      objectPosition: {
        192: "48rem",
      },
      spacing: {
        "1/6": "16.666667%",
      },
    },
  },
  plugins: [],
};
export default config;

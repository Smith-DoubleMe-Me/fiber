/** @type {import('tailwindcss').Config} */

const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) };
const px0_500 = { ...Array.from(Array(501)).map((_, i) => `${i}px`) };
const px0_1000 = { ...Array.from(Array(1001)).map((_, i) => `${i}px`) };
const px0_2000 = { ...Array.from(Array(2001)).map((_, i) => `${i}px`) };

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: px0_1000,
      maxWidth: px0_2000,
      height: px0_1000,
    },
  },
  plugins: [],
};

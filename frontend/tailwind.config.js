/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "Segoe UI", "Arial", "sans-serif"],
      },
      animation: {
        gradient: "gradient 3s linear infinitw",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-position": "0% center",
          },
          "50%": {
            "background-position": "100% center",
          },
        },
      },
      boxShadow: {
        glow: "0px 0px 4px 0px rgb(203 213 225)",
      },
    },
  },
  plugins: [],
};

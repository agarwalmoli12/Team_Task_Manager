/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#f4f6ed",
          100: "#e7ecd4",
          200: "#d1dcb0",
          300: "#b7c783",
          400: "#9aaa59",
          500: "#7d8d3f",
          600: "#657333",
          700: "#515d2c",
          800: "#424c29",
          900: "#384124"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(29, 39, 17, 0.16)"
      }
    },
  },
  plugins: [],
};

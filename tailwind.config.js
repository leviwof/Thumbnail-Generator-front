/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d7eaff",
          500: "#1d4ed8",
          700: "#1e3a8a"
        }
      }
    }
  },
  plugins: []
};


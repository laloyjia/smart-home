/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",
        cardBg: "#1e293b",
        accent: "#0ea5e9",
        neonGreen: "#22c55e",
      },
    },
  },
  plugins: [],
}
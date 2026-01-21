/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        grd: {
          bg: "#050816",
          card: "#0f172a",
          accent: "#22c55e"
        }
      }
    }
  },
  plugins: []
}

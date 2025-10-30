/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tell Tailwind to scan all our TSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

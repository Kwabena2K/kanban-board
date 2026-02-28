/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        btn: '#1ae5e5',
        btnHover: '#17cece',
        header: '#a7a7a8',
      }
    },
  },
  plugins: [],
}
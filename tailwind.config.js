/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        btn: '#0d0d0d',
        btnHover: '#17cece',
        header: '#a7a7a8',
        boards: '#4f4f4f'
      }
    },
  },
  plugins: [],
}
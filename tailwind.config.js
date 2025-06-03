/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xss': '180px',
        'xs': '280px',
        'sm': '520px',
        'md': '800px',
      },
    },
  },
  plugins: [],
}


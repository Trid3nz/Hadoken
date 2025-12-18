/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        press: ['"Press Start 2P"', "system-ui", "sans-serif"],
      },
      colors: {
        "hadoken-bg": "#05020a",
      },
    },
  },
  plugins: [],
}



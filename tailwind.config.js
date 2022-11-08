/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            "opensans": ["Open Sans", "sans-serif"],
            "inter": ["Inter", "sans-serif"]
        }
    },
  },
  plugins: [],
}

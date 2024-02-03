/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { backgroundColor: {
      'fff3e6': '#fff3e6',
      'edc95e': '#edc95e',
      'ffdf80':'#ffdf80',
      'cc9900':'#cc9900',
      'ffbf00':'#ffbf0',
      'ffcc00':'#ffcc00'

    },},
  },
  plugins: [],
}



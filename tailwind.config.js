/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        condensed: ["'Barlow Condensed'", 'sans-serif'],
      },
      gridTemplateColumns: {
        'dashboard': '200px 1fr',
      },
      gridTemplateRows: {
        'dashboard': '48px 1fr',
      },
      // Keyframes are defined in src/index.css (not duplicated here)
      animation: {
        'fadeUp':  'fadeUp 400ms ease-out both',
        'barGrow': 'barGrow 400ms cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer': 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}

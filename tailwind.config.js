/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial'],
        header: ['Arial'],
      },
      colors: {
        background: 'var(--background)',
        text: 'var(--text)',
        subtitle: 'var(--subtitle)',
        card: 'var(--card)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        errorBackground: '#ff000011',
        errorBorder: '#ff0000',
        successBackground: '#00ff0011',
        successBorder: '#00ff00',
        warningBackground: '#ffff0011',
        warningBorder: '#ffff00'
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}
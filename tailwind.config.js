/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#080b14',
        foreground: '#ffffff',
        accent: '#2E8FE0',
        card: '#10141f',
        border: '#232838',
        muted: '#93a0b4',
        whatsapp: '#25D366',
        'whatsapp-dark': '#1DA851'
      },
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
        display: ['Source Serif 4', 'serif']
      }
    }
  }
}

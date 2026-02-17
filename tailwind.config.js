/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-base': 'rgba(255, 255, 255, 0.7)',
        'text-primary': '#2c3e50',
        'text-secondary': '#555555',
        'accent': '#a78bfa',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        korean: ['Noto Sans KR', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      animation: {
        'flip-in': 'flipIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'flip-out': 'flipOut 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
      },
      keyframes: {
        flipIn: {
          '0%': { opacity: '0', transform: 'rotateY(180deg)' },
          '100%': { opacity: '1', transform: 'rotateY(0deg)' },
        },
        flipOut: {
          '0%': { opacity: '1', transform: 'rotateY(0deg)' },
          '100%': { opacity: '0', transform: 'rotateY(-180deg)' },
        },
      }
    },
  },
  plugins: [],
}
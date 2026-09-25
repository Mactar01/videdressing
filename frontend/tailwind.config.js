/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs inspirées d'une esthétique "Watermelon UI" (pastel moderne, tons fruités subtils)
        'watermelon-pink': '#FF477E',
        'watermelon-light': '#FF7096',
        'melon-green': '#06D6A0',
        'glass-bg': 'rgba(255, 255, 255, 0.65)',
        'glass-border': 'rgba(255, 255, 255, 0.4)',
        'dark-glass': 'rgba(17, 24, 39, 0.75)'
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        reshoes: '#FFB647',
        myPrimary: '#fb923c',
        mySecondary: '#FEFFD2',
        myDark: '#64748b',
        myDarkMode: '#1e293b'
      },

      fontFamily: {
        poppins: "Poppins",
        montserrat: "Montserrat"
      },

      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'wiggleCustom': 'wiggle 1s ease-in-out infinite'
      },

      keyframes: {
        wiggle: {
          '0%, 100%' : {transform: 'rotate(-10deg)'},
          '50%': {transform: 'rotate(10deg)'}
        }
      }
    },
  },
  plugins: [
    require('daisyui')
  ],

  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#570df8",
          "secondary": "#f000b8",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "light", // Set theme light as default
      "dark",
    ],
  }
}


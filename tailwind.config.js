/** @type {import('tailwindcss').Config} */
module.exports = {
  selectedTheme: "class",
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      }
    },
    fontFamily: {
      signature: ["Exo 2"]
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "night", "forest", "wireframe", "black", "luxury", "lemonade", "sunset"],
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide'),
    require("daisyui")
  ],
}


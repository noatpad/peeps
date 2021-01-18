const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      opacity: ['disabled']
    },
  },
  plugins: [],
}

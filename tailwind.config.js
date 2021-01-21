module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-10': '-10'
      }
    },
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      opacity: ['disabled'],
      textOpacity: ['disabled']
    },
  },
  plugins: [],
}

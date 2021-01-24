module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        '656': '41rem'
      },
      maxHeight: {
        '3/4': '75%'
      },
      zIndex: {
        '-10': '-10'
      }
    },
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
      opacity: ['disabled'],
      textOpacity: ['disabled']
    },
  },
  plugins: [],
}

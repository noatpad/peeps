module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'twiiter': '#1da1f2',
        'github': '#333'
      },
      height: {
        '656': '41rem'
      },
      width: {
        '120': '30rem'
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

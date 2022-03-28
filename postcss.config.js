const context = require('postcss-plugin-context')

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    context({
      colors: require('./postcss/postcss-hex-to-rgb')
    })
  ]
}

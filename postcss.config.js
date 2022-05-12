function hexToRgb(hex) {
  const [, rr, gg, bb] = hex.match(
    /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i
  )

  return `${parseInt(rr, 16)}, ${parseInt(gg, 16)}, ${parseInt(bb, 16)}`
}

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-functions')({
      functions: {
        hexToRgb,
      },
    }),
  ],
}

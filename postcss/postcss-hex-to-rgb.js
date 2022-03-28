function hexToRgb(hex) {
  const [, rr, gg, bb] = hex.match(
    /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i
  )
  return `${parseInt(rr, 16)}, ${parseInt(gg, 16)}, ${parseInt(bb, 16)}`
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = function () {
  return {
    postcssPlugin: 'postcss-hex-to-rgb',
    Declaration(decl) {
      decl.value = hexToRgb(decl.value)
    },
  }
}

module.exports.postcss = true

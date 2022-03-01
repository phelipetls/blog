'use strict'

exports.name = 'template'
exports.type = 'visitor'
exports.active = true

/**
 *
 * Transform an SVG file to be able to customize its width and height (with the
 * default being 24px).
 *
 */
exports.fn = () => {
  return {
    element: {
      enter: (node) => {
        for (const name of Object.keys(node.attributes)) {
          if (node.name === 'svg') {
            if (name === 'width' || name === 'height') {
              node.attributes[name] = `{{ .${name} | default 24 }}`
            }
          }
        }
      },
    },
  }
}

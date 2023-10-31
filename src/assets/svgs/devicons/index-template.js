// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

function defaultIndexTemplate(filePaths) {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath))
    const exportName = basename
    return `export { default as ${exportName} } from './${basename}'`
  })
  return exportEntries.join('\n')
}

module.exports = defaultIndexTemplate

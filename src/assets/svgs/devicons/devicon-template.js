const template = ({ imports, componentName, jsx, exports }, { tpl }) => {
  return tpl`
    ${imports}

    export const ${componentName} = (props) => {
      return (
        ${jsx}
      )
    }

    ${exports}
  `
}

module.exports = template

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}), ${opacityValue})`
  }
}

module.exports = {
  content: ['./hugo_stats.json', './assets/js/**.js'],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
      },
      zIndex: {
        '-1': '-1',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: withOpacityValue('--primary'),
      divider: withOpacityValue('--divider'),
      foreground: withOpacityValue('--foreground'),
      background: withOpacityValue('--background'),
      code: {
        DEFAULT: withOpacityValue('--foreground-code'),
        background: withOpacityValue('--background-code'),
      },
      note: {
        DEFAULT: withOpacityValue('--note'),
      },
      warn: {
        DEFAULT: withOpacityValue('--warn'),
      },
      heading: {
        DEFAULT: withOpacityValue('--foreground-heading'),
      }
    },
  },
  plugins: [],
}

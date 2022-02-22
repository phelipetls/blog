function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}), ${opacityValue})`
  }
}

module.exports = {
  content: ['./hugo_stats.json'],
  darkMode: 'class', // or 'media' or 'class'
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
      highlight: withOpacityValue('--highlight'),
      divider: withOpacityValue('--divider'),
      foreground: withOpacityValue('--foreground'),
      background: withOpacityValue('--background'),
      code: {
        DEFAULT: withOpacityValue('--foreground-code'),
        background: withOpacityValue('--background-code'),
      },
      note: {
        DEFAULT: withOpacityValue('--foreground-note'),
        background: withOpacityValue('--background-note'),
        border: withOpacityValue('--border-note'),
      },
      warn: {
        DEFAULT: withOpacityValue('--foreground-warn'),
        background: withOpacityValue('--background-warn'),
        border: withOpacityValue('--border-warn'),
      },
    },
  },
  plugins: [],
}

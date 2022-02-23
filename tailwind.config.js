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
      secondary: withOpacityValue('--secondary'),
      divider: withOpacityValue('--divider'),
      surface: withOpacityValue('--surface'),
      foreground: withOpacityValue('--foreground'),
      code: withOpacityValue('--code'),
      background: withOpacityValue('--background'),
      note: withOpacityValue('--note'),
      warn: withOpacityValue('--warn'),
    },
  },
  plugins: [],
}

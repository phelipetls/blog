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
      spacing: {
        'default-padding': '1rem',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: withOpacityValue('--primary'),
      divider: withOpacityValue('--divider'),
      surface: withOpacityValue('--surface'),
      foreground: withOpacityValue('--foreground'),
      background: withOpacityValue('--background'),
      ['secondary-background']: withOpacityValue('--secondary-background'),
      ['code-highlight']: withOpacityValue('--code-highlight'),
      note: withOpacityValue('--note'),
      warn: withOpacityValue('--warn'),
    },
  },
  plugins: [],
}

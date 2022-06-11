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
      foreground: withOpacityValue('--foreground'),
      background: withOpacityValue('--background'),
      surface: withOpacityValue('--surface'),
      ['code-highlight']: withOpacityValue('--code-highlight'),
      note: withOpacityValue('--note'),
      warn: withOpacityValue('--warn'),
      black: {
        [100]: withOpacityValue('--black-100'),
        [200]: withOpacityValue('--black-200'),
        [300]: withOpacityValue('--black-300'),
        [400]: withOpacityValue('--black-400'),
        [500]: withOpacityValue('--black-500'),
        [600]: withOpacityValue('--black-600'),
        [700]: withOpacityValue('--black-700'),
      },
      beige: {
        [100]: withOpacityValue('--beige-100'),
        [200]: withOpacityValue('--beige-200'),
        [300]: withOpacityValue('--beige-300'),
        [400]: withOpacityValue('--beige-400'),
        [500]: withOpacityValue('--beige-500'),
        [600]: withOpacityValue('--beige-600'),
        [700]: withOpacityValue('--beige-700'),
      },
    },
  },
  plugins: [],
}

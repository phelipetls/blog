function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}), ${opacityValue})`
  }
}

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  purge: {
    content: ['./hugo_stats.json', './assets/css/main.css'],
    enabled: process.env.HUGO_ENVIRONMENT === 'production'
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%'
      }
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
      }
    },
  },
  variants: {
    extend: {
      display: ['last', 'group-hover'],
      margin: ['last', 'first']
    },
  },
  plugins: [],
}

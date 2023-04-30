// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

function withOpacityValue(variable) {
  return `rgb(var(${variable}) / <alpha-value>)`
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/{components,layouts,pages}/**/*.{astro,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
        content: 'var(--content-max-width)',
      },
      boxShadow: {
        t: '0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      zIndex: {
        '-1': '-1',
      },
      spacing: {
        'horizontal-padding': 'var(--horizontal-padding)',
        'nav-height': 'var(--nav-height)',
      },
      gridTemplateColumns: {
        layout: `
          [full-start] 1fr
          [content-start] calc(min(var(--content-max-width), 100%) - var(--horizontal-padding) * 2) [content-end]
          1fr [full-end]
        `,
      },
      gridColumn: {
        content: 'content',
        full: 'full',
      },
      colors: {
        primary: withOpacityValue('--primary'),
        'primary-hover': withOpacityValue('--primary-hover'),
        'on-primary': withOpacityValue('--on-primary'),
        divider: withOpacityValue('--divider'),
        shadow: withOpacityValue('--shadow'),
        'on-background': withOpacityValue('--on-background'),
        background: withOpacityValue('--background'),
        surface: withOpacityValue('--surface'),
        hover: withOpacityValue('--hover'),
        disabled: withOpacityValue('--disabled'),
        'on-disabled': withOpacityValue('--on-disabled'),
        note: withOpacityValue('--note'),
        warn: withOpacityValue('--warn'),
      },
    },
    fontFamily: {
      sans: ['Fira Sans', ...defaultTheme.fontFamily.sans],
      serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
      mono: defaultTheme.fontFamily.mono,
    },
  },
  plugins: [],
}

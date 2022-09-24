function withOpacityValue(variable) {
  return `rgb(var(${variable}) / <alpha-value>)`
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./hugo_stats.json', './assets/js/**'],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
        content: 'var(--content-max-width)',
      },
      zIndex: {
        '-1': '-1',
      },
      spacing: {
        'page-padding': 'var(--page-padding)',
      },
      gridTemplateColumns: {
        layout: `
          [full-start] 1fr
          [content-start] calc(min(var(--content-max-width), 100%) - var(--page-padding) * 2) [content-end]
          1fr [full-end]
        `,
      },
      gridColumn: {
        content: 'content',
        full: 'full',
      },
      colors: {
        beige: {
          50: '#FAFAF5',
          100: '#F5F5EA',
          200: '#EAEAD2',
          300: '#E0E0BD',
          400: '#D7D6A8',
          500: '#CCCB91',
          600: '#B6B562',
          700: '#8F8E42',
          800: '#5E5D2C',
          900: '#313017',
        },
        primary: {
          DEFAULT: withOpacityValue('--primary'),
          hover: withOpacityValue('--primary-hover'),
        },
        'on-primary': withOpacityValue('--on-primary'),
        divider: withOpacityValue('--divider'),
        shadow: withOpacityValue('--shadow'),
        'on-background': withOpacityValue('--on-background'),
        background: withOpacityValue('--background'),
        surface: withOpacityValue('--surface'),
        hover: withOpacityValue('--hover'),
        disabled: {
          DEFAULT: withOpacityValue('--disabled'),
        },
        'on-disabled': withOpacityValue('--on-disabled'),
        note: withOpacityValue('--note'),
        warn: withOpacityValue('--warn'),
      },
    },
    fontFamily: {
      sans: ['Fira Sans', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['Consolas', 'Menlo', 'Monaco', 'Fira Code', 'monospace'],
    },
  },
  plugins: [],
}

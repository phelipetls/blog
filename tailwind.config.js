function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}), ${opacityValue})`
  }
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
        'nav-height': 'var(--nav-height)',
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
    },
    fontFamily: {
      sans: ['Fira Sans', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['Consolas', 'Menlo', 'Monaco', 'Fira Code', 'monospace'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: withOpacityValue('--primary'),
      'primary-hover': withOpacityValue('--primary-hover'),
      'primary-fg': withOpacityValue('--primary-fg'),
      divider: withOpacityValue('--divider'),
      shadow: withOpacityValue('--shadow'),
      foreground: withOpacityValue('--foreground'),
      background: withOpacityValue('--background'),
      surface: withOpacityValue('--surface'),
      hover: withOpacityValue('--hover'),
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

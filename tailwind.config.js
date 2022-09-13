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
      light: {
        primary: 'var(--blue)',
        'primary-hover': 'var(--blue-accent)',
        'primary-fg': 'var(--beige-100)',
        foreground: 'var(--black-200)',
        background: 'var(--beige-400)',
        surface: 'var(--beige-200)',
        hover: 'var(--beige-100)',
        divider: 'var(--beige-700)',
        shadow: 'var(--beige-700)',
        note: 'var(--blue)',
        warn: 'var(--red)',
      },
      dark: {
        primary: 'var(--orange)',
        'primary-hover': 'var(--orange-accent)',
        'primary-fg': 'var(--black-600)',
        foreground: 'var(--beige-300)',
        background: 'var(--black-500)',
        surface: 'var(--black-400)',
        hover: 'var(--black-300)',
        divider: 'var(--black-100)',
        shadow: 'var(--black-600)',
        note: 'var(--blue)',
        warn: 'var(--red)',
      },
    },
  },
  plugins: [],
}

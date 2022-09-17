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
      beige: {
        [100]: '#fffff5',
        [200]: '#f6f6e4',
        [300]: '#eeeed3',
        [400]: '#e5e5c2',
        [500]: '#dddcb2',
        [600]: '#d4d4a1',
        [700]: '#cccb91',
      },
      black: {
        [100]: '#595959',
        [200]: '#4c4c4c',
        [300]: '#3e3e3e',
        [400]: '#323232',
        [500]: '#262626',
        [600]: '#1a1a1a',
        [700]: '#151515',
      },
      red: '#dd0022',
      blue: {
        DEFAULT: '#5573cd',
        accent: '#4169e1',
      },
      orange: {
        DEFAULT: '#eeba5e',
        accent: '#f7bd55',
      },
      primary: {
        DEFAULT: withOpacityValue('--primary'),
        hover: withOpacityValue('--primary-hover'),
        fg: withOpacityValue('--primary-fg'),
      },
      divider: withOpacityValue('--divider'),
      shadow: withOpacityValue('--shadow'),
      foreground: withOpacityValue('--foreground'),
      background: withOpacityValue('--background'),
      surface: withOpacityValue('--surface'),
      hover: withOpacityValue('--hover'),
      note: withOpacityValue('--note'),
      warn: withOpacityValue('--warn'),
    },
  },
  plugins: [],
}

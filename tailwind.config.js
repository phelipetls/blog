module.exports = {
  purge: [
    './layouts/**/*.html', './hugo_stats.json'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: 'var(--primary)',
      highlight: 'var(--highlight)',
      divider: 'var(--divider)',
      normal: {
        DEFAULT: 'var(--normal)',
        code: 'var(--normal-code)',
      },
      background: {
        DEFAULT: 'var(--background)',
        code: 'var(--background-code)',
      }
    },
  },
  variants: {
    extend: {
      display: ['last', 'group-hover']
    },
  },
  plugins: [],
}

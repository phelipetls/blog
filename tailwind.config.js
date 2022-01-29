module.exports = {
  purge: {
    content: ['./hugo_stats.json'],
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
      display: ['last', 'group-hover'],
      margin: ['last', 'first']
    },
  },
  plugins: [],
}

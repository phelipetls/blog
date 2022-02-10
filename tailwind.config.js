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
      primary: 'var(--primary)',
      highlight: 'var(--highlight)',
      divider: 'var(--divider)',
      foreground: 'var(--foreground)',
      background: 'var(--background)',
      code: {
        DEFAULT: 'var(--foreground-code)',
        background: 'var(--background-code)',
      },
      note: {
        DEFAULT: 'var(--foreground-note)',
        background: 'var(--background-note)',
        border: 'var(--border-note)',
      },
      warn: {
        DEFAULT: 'var(--foreground-warn)',
        background: 'var(--background-warn)',
        border: 'var(--border-warn)',
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

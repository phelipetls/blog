export {}

declare global {
  interface Window {
    __setTheme: (themeOption: 'light' | 'dark' | 'auto') => void
  }
}

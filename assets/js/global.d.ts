export {}

declare global {
  interface Window {
    __setTheme: (themeOption: ThemeChoice) => void
  }
}

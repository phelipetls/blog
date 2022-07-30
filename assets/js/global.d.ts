import type { ThemeChoice } from './theme'

declare global {
  interface Window {
    __setTheme: (themeOption: ThemeChoice) => void
  }
}

export {}

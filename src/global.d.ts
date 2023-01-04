declare global {
  interface Window {
    __setTheme: (themeChoice: ThemeChoice) => void
  }
}

export {}

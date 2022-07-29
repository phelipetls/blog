type Theme = 'dark' | 'light'
type ThemeChoice = 'dark' | 'light' | 'auto'

function storeThemeChoice(themeChoice: ThemeChoice): void {
  if (themeChoice) {
    localStorage.setItem('__theme', themeChoice)
  }
}

function getStoredThemeChoice() {
  return (localStorage.getItem('__theme') || 'auto') as ThemeChoice
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getThemeFromChoice(themeChoice: ThemeChoice): Theme {
  if (themeChoice === 'auto') {
    return getSystemTheme()
  }
  return themeChoice
}

function setTheme(themeChoice: ThemeChoice): void {
  const theme = getThemeFromChoice(themeChoice)
  document.body.classList.toggle('dark', theme === 'dark')
}

type NewThemeEvent = CustomEvent<{
  theme: Theme
  themeChoice: ThemeChoice
}>

function createNewThemeEvent(themeChoice: ThemeChoice): NewThemeEvent {
  return new CustomEvent('newTheme', {
    detail: {
      themeChoice: themeChoice,
      theme: getThemeFromChoice(themeChoice),
    },
  })
}

function dispatchNewThemeEvent(themeChoice: ThemeChoice): void {
  document.body.dispatchEvent(createNewThemeEvent(themeChoice))
}

window.__setTheme = function (themeChoice: ThemeChoice): void {
  setTheme(themeChoice)
  storeThemeChoice(themeChoice)
  dispatchNewThemeEvent(themeChoice)
}

const storedThemeChoice: ThemeChoice = getStoredThemeChoice()
window.__setTheme(storedThemeChoice)

window.addEventListener('load', function () {
  document.body.removeAttribute('data-preload')
  dispatchNewThemeEvent(storedThemeChoice)
})

window.addEventListener('storage', function (e) {
  const newTheme = e.newValue
  if (e.key === '__theme') {
    window.__setTheme(newTheme as ThemeChoice)
  }
})

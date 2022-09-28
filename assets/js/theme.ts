export type Theme = 'dark' | 'light'
export type ThemeChoice = 'dark' | 'light' | 'auto'

window.__setTheme = setTheme

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

function setTheme(themeChoice: ThemeChoice | null): void {
  if (!themeChoice) {
    return
  }

  changeBodyClass(themeChoice)
  storeThemeChoice(themeChoice)
  dispatchNewThemeEvent(themeChoice)
}

function storeThemeChoice(themeChoice: ThemeChoice): void {
  localStorage.setItem('__theme', themeChoice)
}

export function getStoredThemeChoice() {
  return (localStorage.getItem('__theme') || 'auto') as ThemeChoice
}

function getAutoTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getThemeFromChoice(themeChoice: ThemeChoice): Theme {
  if (themeChoice === 'auto') {
    return getAutoTheme()
  }
  return themeChoice
}

function changeBodyClass(themeChoice: ThemeChoice): void {
  const theme = getThemeFromChoice(themeChoice)
  document.body.classList.toggle('dark', theme === 'dark')
}

export type NewThemeEvent = CustomEvent<{
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

// @ts-check

/** @typedef {'dark' | 'light'} Theme */
/** @typedef {'dark' | 'light' | 'auto'} ThemeChoice */

/** @type {(themeChoice: ThemeChoice) => void} */
function storeThemeChoice(themeChoice) {
  if (themeChoice) {
    localStorage.setItem('__theme', themeChoice)
  }
}

function getStoredThemeChoice() {
  return /** @type {ThemeChoice} */ (localStorage.getItem('__theme') || 'auto')
}

/** @type {() => Theme} */
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/** @type {(themeChoice: ThemeChoice) => Theme} */
function getThemeFromChoice(themeChoice) {
  if (themeChoice === 'auto') {
    return getSystemTheme()
  }
  return themeChoice
}

/** @type {(themeChoice: ThemeChoice) => void} */
function setTheme(themeChoice) {
  const theme = getThemeFromChoice(themeChoice)
  document.body.classList.toggle('dark', theme === 'dark')
}

/** @type {(themeChoice: ThemeChoice) => void} */
function dispatchNewThemeEvent(themeChoice) {
  const event = new CustomEvent('newTheme', {
    detail: {
      themeChoice: themeChoice,
      theme: getThemeFromChoice(themeChoice),
    },
  })

  document.body.dispatchEvent(event)
}

/** @type {(themeChoice: ThemeChoice) => void} */
window.__setTheme = function (themeChoice) {
  setTheme(themeChoice)
  storeThemeChoice(themeChoice)
  dispatchNewThemeEvent(themeChoice)
}

/** @type {ThemeChoice} */
const storedThemeChoice = getStoredThemeChoice()
window.__setTheme(storedThemeChoice)

window.addEventListener('load', function () {
  document.body.removeAttribute('data-preload')
  dispatchNewThemeEvent(storedThemeChoice)
})

window.addEventListener('storage', function (e) {
  const newTheme = e.newValue
  if (e.key === '__theme') {
    // @ts-expect-error
    window.__setTheme(newTheme)
  }
})

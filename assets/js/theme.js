// @ts-check

/** @typedef {'dark' | 'light'} Theme */
/** @typedef {'dark' | 'light' | 'auto'} ThemeOption */

/** @type {(themeOption: ThemeOption) => void} */
function storeThemeOption(themeOption) {
  if (themeOption) {
    localStorage.setItem('__theme', themeOption)
  }
}

function getStoredThemeOption() {
  return /** @type {ThemeOption} */ (localStorage.getItem('__theme') || 'auto')
}

/** @type {() => Theme} */
function getAutoTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/** @type {(themeOption: ThemeOption) => Theme} */
function getThemeFromOption(themeOption) {
  if (themeOption === 'auto') {
    return getAutoTheme()
  }
  return themeOption
}

/** @type {(themeOption: ThemeOption) => void} */
function setTheme(themeOption) {
  const newTheme = getThemeFromOption(themeOption)
  document.body.classList.toggle('dark', newTheme === 'dark')
}

/** @type {(themeOption: ThemeOption) => void} */
function dispatchNewThemeEvent(themeOption) {
  const event = new CustomEvent('newTheme', {
    detail: {
      theme: getThemeFromOption(themeOption),
    },
  })

  document.body.dispatchEvent(event)
}

/** @type {(themeOption: ThemeOption) => void} */
window.__setTheme = function (themeOption) {
  setTheme(themeOption)
  storeThemeOption(themeOption)
  dispatchNewThemeEvent(themeOption)
}

/** @type {ThemeOption} */
const storedThemeOption = getStoredThemeOption()
window.__setTheme(storedThemeOption)

window.addEventListener('load', function () {
  document.body.removeAttribute('data-preload')
})

window.addEventListener('storage', function (e) {
  const newTheme = e.newValue
  if (e.key === '__theme') {
    // @ts-expect-error
    window.__setTheme(newTheme)
  }
})

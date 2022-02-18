function storeTheme(newTheme) {
  if (newTheme) {
    localStorage.setItem('__theme', newTheme)
  }
}

function getStoredTheme() {
  return localStorage.getItem('__theme')
}

function setTheme(newTheme) {
  if (newTheme === 'auto') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      newTheme = 'dark'
    }
  }

  if (newTheme === 'dark') {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}

function dispatchNewThemeEvent(newTheme) {
  const event = new CustomEvent('newTheme', {
    detail: {
      theme: newTheme,
    },
  })

  document.body.dispatchEvent(event)
}

window.__setTheme = function (newTheme) {
  setTheme(newTheme)
  storeTheme(newTheme)
  dispatchNewThemeEvent(newTheme)
}

const storedTheme = getStoredTheme() || 'auto'
window.__setTheme(storedTheme)

window.addEventListener('load', function () {
  document.body.removeAttribute('data-preload')
  dispatchNewThemeEvent(storedTheme)
})

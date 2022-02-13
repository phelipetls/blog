window.__setTheme = function (newTheme) {
  document.body.setAttribute('data-theme', newTheme)
  localStorage.setItem('__theme', newTheme)
}

const storedTheme = localStorage.getItem('__theme')

if (storedTheme) {
  window.__setTheme(storedTheme)
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  window.__setTheme('dark')
}

/* Enable animations */
window.addEventListener('load', function () {
  document.body.classList.remove('preload')
})

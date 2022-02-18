const themeButton = document.querySelector('[data-theme-button]')

const toggleSvgIcon = function (theme) {
  const svgIcon = document.querySelector('[data-theme-button-svg-icon]')

  const icon = theme === 'dark' ? '#sun' : '#moon'
  svgIcon.setAttribute('href', icon)
}

const theme = localStorage.getItem('__theme')

if (theme) {
  toggleSvgIcon(theme)
}

themeButton.addEventListener('click', function () {
  const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark'

  window.__setTheme(newTheme)
  toggleSvgIcon(newTheme)
})

import { initialize } from './menu'

const button = document.querySelector('[data-theme-button]')

function setMenuItemTheme(item) {
  window.__setTheme(item.dataset.theme)
}

initialize(button, {
  onClick: setMenuItemTheme,
  isSelectedItem: function (item) {
    return item.dataset.theme === localStorage.getItem('__theme')
  },
})

document.body.addEventListener('newTheme', function (e) {
  function changeButtonIcon(theme) {
    const icon = {
      dark: '#moon',
      light: '#sun',
      auto: '#monitor',
    }[theme]

    const buttonIcon = document.querySelector('[data-theme-button-svg-icon]')
    buttonIcon.setAttribute('href', icon)
  }

  const theme = e.detail.theme
  changeButtonIcon(theme)
})

import { initialize } from './listbox'

const button = document.querySelector('[data-theme-button]')

function setOptionTheme(item) {
  window.__setTheme(item.dataset.theme)
}

initialize(button, {
  onClick: setOptionTheme,
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

  const themeChoice = e.detail.themeChoice
  changeButtonIcon(themeChoice)
})

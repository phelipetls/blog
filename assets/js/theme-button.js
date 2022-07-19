import { initialize } from './listbox'

const button = document.querySelector('[data-theme-button]')

initialize(button, {
  onClick: function (listItem) {
    window.__setTheme(listItem.dataset.theme)
  },
  isSelectedItem: function (listItem) {
    return listItem.dataset.theme === localStorage.getItem('__theme')
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

import { initialize } from './listbox'

const button = document.querySelector(
  '[data-theme-button]'
) as HTMLButtonElement

initialize(button, {
  onClick: function (listItem) {
    const themeChoice = listItem?.dataset.theme

    if (!themeChoice) {
      return
    }

    window.__setTheme(themeChoice as ThemeChoice)
  },
  isSelectedItem: function (listItem) {
    return listItem.dataset.theme === localStorage.getItem('__theme')
  },
})

document.body.addEventListener('newTheme', function (e: NewThemeEvent) {
  function changeButtonIcon(theme: ThemeChoice) {
    const icon = {
      dark: '#moon',
      light: '#sun',
      auto: '#monitor',
    }[theme]

    const buttonIcon = document.querySelector(
      '[data-theme-button-svg-icon]'
    ) as HTMLButtonElement

    buttonIcon.setAttribute('href', icon)
  }

  const themeChoice = e.detail.themeChoice
  changeButtonIcon(themeChoice)
} as EventListener)

import type { ThemeChoice, NewThemeEvent } from './theme'

const themeSelects = document.querySelectorAll('[data-theme-select]')

themeSelects?.forEach((themeSelect) =>
  themeSelect.addEventListener('change', function (e) {
    if (!e.target) {
      return
    }

    const selectedOption = (e.target as HTMLSelectElement).selectedOptions[0]
    window.__setTheme(selectedOption.value as ThemeChoice)
  })
)

document.body.addEventListener('newTheme', function (e: NewThemeEvent) {
  function changeThemeSelectIcon(theme: ThemeChoice) {
    const icon = {
      dark: '#moon',
      light: '#sun',
      auto: '#monitor',
    }[theme]

    const themeSelectIcons = document.querySelectorAll<HTMLElement>(
      '[data-theme-select-icon]'
    )

    themeSelectIcons?.forEach((themeSelectIcon) =>
      themeSelectIcon.setAttribute('href', icon)
    )
  }

  const themeChoice = e.detail.themeChoice
  changeThemeSelectIcon(themeChoice)
} as EventListener)

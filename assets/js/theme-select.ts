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
  const themeChoice = e.detail.themeChoice

  function changeThemeSelectIcon(themeChoice: ThemeChoice) {
    const icon = {
      dark: '#moon',
      light: '#sun',
      auto: '#monitor',
    }[themeChoice]

    themeSelects.forEach((themeSelect) => {
      themeSelect
        .querySelector<HTMLElement>('[data-theme-select-icon]')
        ?.setAttribute('href', icon)
    })
  }

  changeThemeSelectIcon(themeChoice)
} as EventListener)

import type { ThemeChoice, NewThemeEvent } from './theme'
import { getStoredThemeChoice } from './theme'

const themeSelects = document.querySelectorAll<HTMLSelectElement>(
  '[data-theme-select]'
)

themeSelects?.forEach((themeSelect) => {
  const storedThemeChoice: ThemeChoice = getStoredThemeChoice()
  const themeChoiceOption = Array.from(themeSelect.options).find(
    (option) => option.value === storedThemeChoice
  )
  if (themeChoiceOption) {
    themeChoiceOption.setAttribute('selected', '')
  }

  themeSelect.addEventListener('change', function (e) {
    if (!e.target) {
      return
    }

    const selectedOption = (e.target as HTMLSelectElement).selectedOptions[0]
    window.__setTheme(selectedOption.value as ThemeChoice)
  })
})

document.body.addEventListener('newTheme', function (e: NewThemeEvent) {
  const themeChoice = e.detail.themeChoice

  function changeThemeSelectIcon(themeChoice: ThemeChoice) {
    const icon = {
      dark: '#moon',
      light: '#sun',
      system: '#monitor',
    }[themeChoice]

    themeSelects.forEach((themeSelect) => {
      themeSelect
        .querySelector<HTMLElement>('[data-theme-select-icon]')
        ?.setAttribute('href', icon)
    })
  }

  changeThemeSelectIcon(themeChoice)
} as EventListener)

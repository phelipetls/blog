import { ChevronDown, Moon, Sun, Monitor } from 'lucide-react'
import { useState } from 'react'

type ThemeSelectProps = {
  lightThemeLabel: string
  darkThemeLabel: string
  systemThemeLabel: string
  selectAriaLabel: string
}

export const ThemeSelect = (props: ThemeSelectProps) => {
  const [theme, setTheme] = useState<ThemeChoice>(() => {
    const storedThemeChoice = window.localStorage.getItem(
      '__theme'
    ) as ThemeChoice

    return storedThemeChoice ?? 'system'
  })

  const icon = {
    dark: <Moon id="moon" />,
    light: <Sun id="sun" />,
    system: <Monitor id="monitor" />,
  }[theme]

  return (
    <div className="relative flex h-full flex-row items-center">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm">
        {icon}
      </span>

      <select
        className="card h-full appearance-none bg-surface px-8 py-1 text-center"
        aria-label={props.systemThemeLabel}
        onChange={(e) => {
          const selectedTheme = e.target.selectedOptions[0].value as ThemeChoice
          setTheme(selectedTheme)
          window.__setTheme(selectedTheme)
        }}
      >
        <option selected={theme === 'light'} value="light">
          {props.lightThemeLabel}
        </option>
        <option selected={theme === 'dark'} value="dark">
          {props.darkThemeLabel}
        </option>
        <option selected={theme === 'system'} value="system">
          {props.systemThemeLabel}
        </option>
      </select>

      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm">
        <ChevronDown />
      </span>
    </div>
  )
}

export default ThemeSelect

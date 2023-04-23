import i18next from 'i18next'
import englishTranslations from './translations/en.json'
import portugueseTranslations from './translations/pt.json'
import type { Language } from './getLanguageFromUrl'

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
}

const resources = {
  pt: {
    translation: portugueseTranslations,
  },
  en: {
    translation: englishTranslations,
  },
} as const

await i18next.init({
  resources,
  returnNull: false,
})

export const translate = (lang: Language) => {
  i18next.changeLanguage(lang)
  return i18next.t
}

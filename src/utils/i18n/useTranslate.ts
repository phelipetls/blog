import type { Locale } from './locales'
import { en } from './translations/en'
import { pt } from './translations/pt'

export const useTranslate = (locale: Locale) => {
  let dictionary = en

  if (locale === 'pt') {
    dictionary = pt
  }

  return dictionary
}

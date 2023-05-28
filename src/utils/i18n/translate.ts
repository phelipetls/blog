import L from '@i18n/i18n-node'
import type { Language } from './getLanguageFromUrl'

export const translate = (lang: Language) => {
  return L[lang]
}

import type { Language } from './getLanguageFromUrl'

export function localizeUrl(url: string, language: Language) {
  if (language === 'pt') {
    return '/pt' + url
  }

  return url
}

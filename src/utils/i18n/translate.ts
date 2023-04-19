import Mustache from 'mustache'
import englishTranslations from './translations/en.json'
import portugueseTranslations from './translations/ptBR.json'
import type { Language } from './getLanguageFromUrl'

type Translation = { one: string; other?: string }
type TranslateOptions = { n?: number; vars?: Record<string, unknown> }

export const translate = (lang: Language) => {
  return (key: string, options?: TranslateOptions): string => {
    let translations: Translation | undefined

    if (lang === 'en') {
      if (key in englishTranslations) {
        translations =
          englishTranslations[key as keyof typeof englishTranslations]
      }
    }

    if (lang === 'pt') {
      if (key in englishTranslations) {
        translations =
          portugueseTranslations[key as keyof typeof portugueseTranslations]
      }
    }

    if (translations) {
      let translation =
        options && options.n && options.n > 1 && translations.other
          ? translations.other
          : translations.one

      if (options?.vars) {
        translation = Mustache.render(translation, options.vars)
      }

      if (translation) {
        return translation
      }
    }

    return key
  }
}

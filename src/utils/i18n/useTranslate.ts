import type { AstroGlobal } from 'astro'
import { getLanguageFromUrl } from './getLanguageFromUrl'
import { translate } from './translate'

export const useTranslate = (Astro: Readonly<AstroGlobal>) => {
  const lang = getLanguageFromUrl(Astro.url.pathname)

  return translate(lang)
}

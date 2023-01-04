export type Language = 'pt' | 'en'

export function getLanguageFromUrl(pathname: string): Language {
  if (pathname.startsWith('/pt')) {
    return 'pt'
  }

  return 'en'
}

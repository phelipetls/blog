export const LOCALES = ['en', 'pt'] as const

export type Locale = (typeof LOCALES)[number]

import { Language, localizeUrl } from '@utils/i18n'

export const getMainMenuItems = (language: Language) => {
  return [
    {
      name: 'About',
      identifier: 'about',
      pathname: localizeUrl('/', language),
    },
    {
      name: 'Posts',
      identifier: 'posts',
      pathname: localizeUrl('/posts', language),
    },
    {
      name: 'Résumé',
      identifier: 'resume',
      pathname: localizeUrl('/resume', language),
    },
  ]
}

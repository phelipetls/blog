import type { NewThemeEvent, Theme } from './theme'

document
  .querySelector('[data-utterances-client-script]')
  ?.addEventListener('load', () => {
    const iframe =
      document.querySelector<HTMLIFrameElement>('.utterances-frame')

    function changeUtterancesTheme(theme: Theme) {
      iframe?.contentWindow?.postMessage(
        {
          type: 'set-theme',
          theme: theme === 'dark' ? 'github-dark' : 'github-light',
        },
        'https://utteranc.es'
      )
    }

    iframe?.addEventListener('load', () => {
      changeUtterancesTheme(
        document.body.classList.contains('dark') ? 'dark' : 'light'
      )

      document.body.addEventListener('newTheme', function (e: NewThemeEvent) {
        changeUtterancesTheme(e.detail.theme)
      } as EventListener)
    })
  })

export {}

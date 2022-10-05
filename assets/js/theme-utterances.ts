import type { NewThemeEvent, Theme } from './theme'
;(() => {
  const utterancesScript = document.querySelector(
    '[data-utterances-client-script]'
  )

  if (!utterancesScript) {
    return
  }

  const removeLoading = () => {
    document.querySelector('[data-utterances-loading]')?.remove()
  }

  utterancesScript.addEventListener('load', () => {
    const iframe =
      document.querySelector<HTMLIFrameElement>('.utterances-frame')

    if (!iframe) {
      return
    }

    const changeUtterancesTheme = (theme: Theme) => {
      iframe.contentWindow?.postMessage(
        {
          type: 'set-theme',
          theme: theme === 'dark' ? 'github-dark' : 'github-light',
        },
        'https://utteranc.es'
      )
    }

    iframe.addEventListener('load', () => {
      removeLoading()

      changeUtterancesTheme(
        document.body.classList.contains('dark') ? 'dark' : 'light'
      )

      document.body.addEventListener('newTheme', function (e: NewThemeEvent) {
        changeUtterancesTheme(e.detail.theme)
      } as EventListener)
    })

    iframe.addEventListener('error', () => {
      removeLoading()
    })
  })

  utterancesScript.addEventListener('error', () => {
    removeLoading()
  })
})()

export {}

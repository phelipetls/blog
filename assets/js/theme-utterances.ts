import type { NewThemeEvent, Theme } from './theme'
;(() => {
  const utterancesTemplate = document.querySelector<HTMLTemplateElement>(
    '[data-utterances-template]'
  )

  if (!utterancesTemplate || !utterancesTemplate.content) {
    return
  }

  const content = utterancesTemplate.content.cloneNode(true)
  const utterancesScript = (content as HTMLElement).querySelector('script')
  const utterancesLoading = (content as HTMLElement).querySelector(
    '[data-utterances-loading]'
  )

  utterancesTemplate?.parentElement?.insertBefore(content, utterancesTemplate)

  if (!utterancesScript) {
    return
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
      utterancesLoading?.remove()

      changeUtterancesTheme(
        document.body.classList.contains('dark') ? 'dark' : 'light'
      )

      document.body.addEventListener('newTheme', function (e: NewThemeEvent) {
        changeUtterancesTheme(e.detail.theme)
      } as EventListener)
    })

    iframe.addEventListener('error', () => {
      utterancesLoading?.remove()
    })
  })

  utterancesScript.addEventListener('error', () => {
    utterancesLoading?.remove()
  })
})()

export {}

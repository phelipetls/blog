document.body.addEventListener('newTheme', function (e: NewThemeEvent) {
  const iframe = document.querySelector<HTMLIFrameElement>('.utterances-frame')

  if (!iframe) {
    return
  }

  iframe.contentWindow.postMessage(
    {
      type: 'set-theme',
      theme: (e.detail).theme === 'dark' ? 'github-dark' : 'github-light',
    },
    'https://utteranc.es'
  )
})

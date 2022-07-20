document.body.addEventListener('newTheme', function (e) {
  const iframe = document.querySelector('.utterances-frame')

  if (!iframe) {
    return
  }

  iframe.contentWindow.postMessage(
    {
      type: 'set-theme',
      theme: e.detail.theme === 'dark' ? 'github-dark' : 'github-light',
    },
    'https://utteranc.es'
  )
})

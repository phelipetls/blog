for (const reactIframeContainer of document.querySelectorAll(
  '[data-react-iframe-container]'
)) {
  const refreshButton = reactIframeContainer.querySelector(
    '[data-react-iframe-refresh]'
  )

  refreshButton?.addEventListener('click', () => {
    const iframe = reactIframeContainer.querySelector('iframe')
    iframe?.contentWindow?.location.reload()
  })
}

export {}

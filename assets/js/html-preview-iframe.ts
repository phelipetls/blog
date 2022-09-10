const reactIframeContainers = document.querySelectorAll(
  '[data-html-preview-iframe-container]'
)

for (const reactIframeContainer of reactIframeContainers) {
  const refreshButton = reactIframeContainer.querySelector(
    '[data-html-preview-iframe-refresh]'
  )

  refreshButton?.addEventListener('click', () => {
    const iframe = reactIframeContainer.querySelector('iframe')
    iframe?.contentWindow?.location.reload()
  })
}

export {}

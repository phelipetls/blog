const reactIframeContainers = document.querySelectorAll(
  '[data-react-iframe-container]'
)

for (const reactIframeContainer of reactIframeContainers) {
  const refreshButton = reactIframeContainer.querySelector(
    '[data-react-iframe-refresh]'
  )

  refreshButton?.addEventListener('click', () => {
    const iframe = reactIframeContainer.querySelector('iframe')
    iframe?.contentWindow?.location.reload()
  })
}

export {}

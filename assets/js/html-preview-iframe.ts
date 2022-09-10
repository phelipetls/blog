const htmlPreviewIframeContainers = document.querySelectorAll(
  '[data-html-preview-iframe-container]'
)

for (const htmlPreviewIframe of htmlPreviewIframeContainers) {
  const refreshButton = htmlPreviewIframe.querySelector(
    '[data-html-preview-iframe-refresh]'
  )

  refreshButton?.addEventListener('click', () => {
    const iframe = htmlPreviewIframe.querySelector('iframe')
    iframe?.contentWindow?.location.reload()
  })
}

export {}

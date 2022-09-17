const htmlPreviewIframeContainers = document.querySelectorAll(
  '[data-html-preview-iframe-container]'
)

for (const htmlPreviewIframe of htmlPreviewIframeContainers) {
  const refreshButton = htmlPreviewIframe.querySelector(
    '[data-html-preview-iframe-refresh]'
  )

  const refreshIcon = refreshButton?.querySelector('svg')

  refreshButton?.addEventListener('click', () => {
    const iframe = htmlPreviewIframe.querySelector('iframe')
    iframe?.contentWindow?.location.reload()

    refreshButton?.setAttribute('disabled', '')
    refreshIcon?.classList.add('animate-spin')

    iframe?.addEventListener('load', () => {
      refreshButton?.removeAttribute('disabled')
      refreshIcon?.classList.remove('animate-spin')
    })
  })
}

export {}

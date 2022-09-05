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

const showMoreCodeButtons = document.querySelectorAll<HTMLElement>(
  '[data-react-show-more-code]'
)

for (const showMoreCodeButton of showMoreCodeButtons) {
  showMoreCodeButton?.addEventListener('click', () => {
    const codeContainer =
      showMoreCodeButton.parentElement?.querySelector<HTMLElement>(
        '[data-react-code-container]'
      )

    if (!codeContainer) {
      return
    }

    const expandedLabel = showMoreCodeButton.dataset.expandedLabel || ''
    const collapsedLabel = showMoreCodeButton.dataset.collapsedLabel || ''

    const expandCodeBlock = () => {
      codeContainer.style.height = 'auto'
      codeContainer.style.maxHeight = 'none'
      codeContainer.setAttribute('data-is-expanded', 'true')

      showMoreCodeButton.querySelector('svg')?.classList.add('rotate-180')
      showMoreCodeButton.innerHTML =
        showMoreCodeButton.innerHTML?.replace(expandedLabel, collapsedLabel) ||
        ''
    }

    const collapseCodeBlock = () => {
      codeContainer.style.height = ''
      codeContainer.style.maxHeight = ''
      codeContainer.setAttribute('data-is-expanded', 'false')

      showMoreCodeButton.querySelector('svg')?.classList.remove('rotate-180')
      showMoreCodeButton.innerHTML =
        showMoreCodeButton.innerHTML?.replace(collapsedLabel, expandedLabel) ||
        ''
    }

    if (codeContainer.getAttribute('data-is-expanded') === 'true') {
      collapseCodeBlock()
    } else {
      expandCodeBlock()
    }
  })
}

export {}

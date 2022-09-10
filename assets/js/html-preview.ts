const expandCodeBlockButtons = document.querySelectorAll<HTMLElement>(
  '[data-html-preview-expand-codeblock]'
)

for (const expandCodeBlockButton of expandCodeBlockButtons) {
  expandCodeBlockButton?.addEventListener('click', () => {
    const codeBlockContainer =
      expandCodeBlockButton.parentElement?.querySelector<HTMLElement>(
        '[data-html-preview-codeblock-container]'
      )

    if (!codeBlockContainer) {
      return
    }

    const expandedLabel = expandCodeBlockButton.dataset.expandedLabel || ''
    const collapsedLabel = expandCodeBlockButton.dataset.collapsedLabel || ''

    const expandCodeBlock = () => {
      codeBlockContainer.style.height = 'auto'
      codeBlockContainer.style.maxHeight = 'none'
      codeBlockContainer.setAttribute('data-is-expanded', 'true')

      expandCodeBlockButton.querySelector('svg')?.classList.add('rotate-180')
      expandCodeBlockButton.innerHTML =
        expandCodeBlockButton.innerHTML?.replace(
          expandedLabel,
          collapsedLabel
        ) || ''
    }

    const collapseCodeBlock = () => {
      codeBlockContainer.style.height = ''
      codeBlockContainer.style.maxHeight = ''
      codeBlockContainer.setAttribute('data-is-expanded', 'false')

      expandCodeBlockButton.querySelector('svg')?.classList.remove('rotate-180')
      expandCodeBlockButton.innerHTML =
        expandCodeBlockButton.innerHTML?.replace(
          collapsedLabel,
          expandedLabel
        ) || ''
    }

    if (codeBlockContainer.getAttribute('data-is-expanded') === 'true') {
      collapseCodeBlock()
    } else {
      expandCodeBlock()
    }
  })
}

export {}

const toggleExpandedCodeBlockButtons = document.querySelectorAll<HTMLElement>(
  '[data-html-preview-toggle-expanded-codeblock]'
)

for (const toggleExpandedCodeBlockButton of toggleExpandedCodeBlockButtons) {
  toggleExpandedCodeBlockButton?.addEventListener('click', () => {
    const codeBlockContainer =
      toggleExpandedCodeBlockButton.parentElement?.querySelector<HTMLElement>(
        '[data-html-preview-codeblock-container]'
      )

    if (!codeBlockContainer) {
      return
    }

    const expandedLabel =
      toggleExpandedCodeBlockButton.dataset.expandedLabel || ''
    const collapsedLabel =
      toggleExpandedCodeBlockButton.dataset.collapsedLabel || ''

    const expandCodeBlock = () => {
      codeBlockContainer.setAttribute('data-is-expanded', 'true')

      toggleExpandedCodeBlockButton
        .querySelector('svg')
        ?.classList.add('rotate-180')
      toggleExpandedCodeBlockButton.innerHTML =
        toggleExpandedCodeBlockButton.innerHTML?.replace(
          expandedLabel,
          collapsedLabel
        ) || ''
    }

    const collapseCodeBlock = () => {
      codeBlockContainer.setAttribute('data-is-expanded', 'false')

      toggleExpandedCodeBlockButton
        .querySelector('svg')
        ?.classList.remove('rotate-180')
      toggleExpandedCodeBlockButton.innerHTML =
        toggleExpandedCodeBlockButton.innerHTML?.replace(
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

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

    const chevronIcon = toggleExpandedCodeBlockButton.querySelector('svg')

    if (!chevronIcon) {
      return
    }

    chevronIcon.classList.add(
      'transition-transform',
      'duration-500',
      'ease-in-out'
    )
    chevronIcon.style.transform = 'rotate(0deg)'

    const expandedLabel =
      toggleExpandedCodeBlockButton.dataset.expandedLabel || ''

    const collapsedLabel =
      toggleExpandedCodeBlockButton.dataset.collapsedLabel || ''

    const changeButtonText = (text: string) => {
      const textContainer =
        toggleExpandedCodeBlockButton.querySelector('[data-text]')

      if (textContainer) {
        textContainer.textContent = text
      }
    }

    const expandCodeBlock = () => {
      codeBlockContainer.setAttribute('data-is-expanded', 'true')
      chevronIcon.style.transform = 'rotate(180deg)'
      changeButtonText(collapsedLabel)
    }

    const collapseCodeBlock = () => {
      codeBlockContainer.setAttribute('data-is-expanded', 'false')
      chevronIcon.style.transform = 'rotate(0deg)'
      changeButtonText(expandedLabel)
    }

    if (codeBlockContainer.getAttribute('data-is-expanded') === 'true') {
      collapseCodeBlock()
    } else {
      expandCodeBlock()
    }
  })
}

export {}

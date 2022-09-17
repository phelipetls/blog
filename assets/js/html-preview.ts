const expandCollapseButtons = document.querySelectorAll<HTMLElement>(
  '[data-html-expand-collapse-button]'
)

for (const expandCollapseButton of expandCollapseButtons) {
  expandCollapseButton?.addEventListener('click', () => {
    const codeBlockContainer =
      expandCollapseButton.parentElement?.querySelector<HTMLElement>(
        '[data-html-preview-codeblock-container]'
      )
    if (!codeBlockContainer) {
      return
    }

    const chevronIcon = expandCollapseButton.querySelector('svg')
    if (!chevronIcon) {
      return
    }

    chevronIcon.classList.add(
      'transition-transform',
      'duration-500',
      'ease-in-out'
    )

    const expandedLabel = expandCollapseButton.dataset.expandedLabel || ''

    const collapsedLabel = expandCollapseButton.dataset.collapsedLabel || ''

    const changeButtonText = (text: string) => {
      const textContainer = expandCollapseButton.querySelector('[data-text]')

      if (textContainer) {
        textContainer.textContent = text
      }
    }

    const expandCodeBlock = () => {
      codeBlockContainer.setAttribute('data-is-expanded', 'true')
      chevronIcon.classList.add('rotate-180')
      changeButtonText(collapsedLabel)
    }

    const collapseCodeBlock = () => {
      codeBlockContainer.setAttribute('data-is-expanded', 'false')
      chevronIcon.classList.remove('rotate-180')
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

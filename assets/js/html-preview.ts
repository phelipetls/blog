const expandCollapseButtons = document.querySelectorAll<HTMLElement>(
  '[data-html-expand-collapse-button]'
)

for (const expandCollapseButton of expandCollapseButtons) {
  expandCollapseButton?.addEventListener('click', () => {
    const codeBlockContainer = expandCollapseButton
      .closest('[data-html-preview]')
      ?.querySelector<HTMLElement>('[data-html-preview-codeblock-container]')

    if (!codeBlockContainer) {
      return
    }

    const codeBlock = codeBlockContainer.querySelector('pre')

    if (!codeBlock) {
      return
    }

    const isCollapsed = codeBlockContainer.dataset.isCollapsed === 'true'

    const expandCodeBlock = () => {
      const scrollbarHeight = codeBlock.scrollHeight - codeBlock.clientHeight
      const maxHeight = codeBlock.scrollHeight + scrollbarHeight
      codeBlock.style.maxHeight = `${maxHeight}px`
      codeBlockContainer.setAttribute('data-is-collapsed', 'false')
    }

    const collapseCodeBlock = () => {
      codeBlock.style.maxHeight = ''
      codeBlockContainer.setAttribute('data-is-collapsed', 'true')
    }

    if (isCollapsed) {
      expandCodeBlock()
    } else {
      collapseCodeBlock()
    }
  })
}

export {}

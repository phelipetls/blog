import * as params from '@params'

declare module '@params' {
  export const showLess: string
  export const showMore: string
}

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
    if (codeBlock) {
      codeBlock.classList.add('transition-[max-height]', 'duration-300', 'ease')
    }

    const chevronIcon = expandCollapseButton.querySelector('svg')
    if (!chevronIcon) {
      return
    }

    chevronIcon.classList.add('transition-transform', 'duration-300', 'ease')

    const changeButtonText = (text: string) => {
      const textContainer = expandCollapseButton.querySelector('[data-text]')

      if (textContainer) {
        textContainer.textContent = text
      }
    }

    const maxLinesOfCode = Number(codeBlockContainer.dataset.maxLinesOfCode)

    const linesCount =
      codeBlock?.querySelectorAll('.line').length || maxLinesOfCode

    const isExpanded =
      Number(codeBlockContainer.style.getPropertyValue('--is-expanded')) === 1

    const expandCodeBlock = () => {
      codeBlockContainer.style.setProperty(
        '--lines-of-code',
        String(linesCount)
      )
      codeBlockContainer.style.setProperty('--is-expanded', '1')
      chevronIcon.classList.add('rotate-180')
      changeButtonText(params.showLess)
    }

    const collapseCodeBlock = () => {
      codeBlockContainer.style.setProperty('--is-expanded', '0')
      codeBlockContainer.style.setProperty(
        '--lines-of-code',
        String(maxLinesOfCode)
      )
      chevronIcon.classList.remove('rotate-180')
      changeButtonText(params.showMore)
    }

    if (isExpanded) {
      collapseCodeBlock()
    } else {
      expandCodeBlock()
    }
  })
}

export {}

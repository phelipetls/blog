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
    const codeBlockContainer =
      expandCollapseButton.parentElement?.querySelector<HTMLElement>(
        '[data-html-preview-codeblock-container]'
      )
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

    const maxLinesOfCode =
      Number(codeBlockContainer.dataset.maxLinesOfCode) || 20

    const linesCount =
      codeBlock?.querySelectorAll('.line').length || maxLinesOfCode

    const expandCodeBlock = () => {
      codeBlockContainer.setAttribute('data-is-expanded', 'true')
      codeBlockContainer.style.setProperty(
        '--number-of-lines',
        String(linesCount)
      )
      chevronIcon.classList.add('rotate-180')
      changeButtonText(params.showLess)
    }

    const collapseCodeBlock = () => {
      codeBlockContainer.setAttribute('data-is-expanded', 'false')
      codeBlockContainer.style.setProperty(
        '--number-of-lines',
        String(maxLinesOfCode)
      )
      chevronIcon.classList.remove('rotate-180')
      changeButtonText(params.showMore)
    }

    if (codeBlockContainer.getAttribute('data-is-expanded') === 'true') {
      collapseCodeBlock()
    } else {
      expandCodeBlock()
    }
  })
}

export {}

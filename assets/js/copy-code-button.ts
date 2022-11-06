import { computePosition, offset, shift, arrow } from '@floating-ui/dom'

const copyCodeButtons = document.querySelectorAll<HTMLElement>(
  '[data-copy-code-button]'
)

for (const copyCodeButton of copyCodeButtons) {
  copyCodeButton.classList.remove('hidden')
  addEventHandlersToCopyCodeButton(copyCodeButton)
}

const tooltipTemplate = document.querySelector<HTMLTemplateElement>(
  '[data-theme-copy-code-tooltip-template]'
)

function addEventHandlersToCopyCodeButton(button: HTMLElement) {
  button.addEventListener('focus', function () {
    button.classList.add('opacity-100')
    button.classList.remove('pointer-events-none')
  })

  button.addEventListener('blur', function () {
    button.classList.remove('opacity-100')
    button.classList.add('pointer-events-none')
  })

  button.addEventListener('click', async function () {
    const codeBlock = button.parentElement?.querySelector('pre code')

    if (!codeBlock) {
      return
    }

    const codeBlockTextContent = codeBlock.textContent

    if (!codeBlockTextContent) {
      return
    }

    await navigator.clipboard.writeText(codeBlockTextContent.trimEnd())

    if (!tooltipTemplate) {
      return
    }

    const tooltipContent = tooltipTemplate.content.cloneNode(true)
    document.body.append(tooltipContent)

    const tooltip = document.body.querySelector<HTMLElement>(
      '[data-theme-copy-code-tooltip]'
    )

    if (!tooltip) {
      return
    }

    const tooltipArrow = tooltip.querySelector<HTMLElement>('[data-arrow]')

    if (!tooltipArrow) {
      return
    }

    button.setAttribute('data-user-copied', 'true')

    const { x, y, middlewareData } = await computePosition(button, tooltip, {
      placement: 'top',
      middleware: [
        shift({ padding: 8 }),
        offset(8),
        arrow({ element: tooltipArrow }),
      ],
    })

    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
      animation: 'tooltip-animation 1.5s',
    })

    setTimeout(() => {
      button.setAttribute('data-user-copied', 'false')
      tooltip.remove()
    }, 1000)

    const arrowX = middlewareData.arrow?.x
    const arrowY = middlewareData.arrow?.y

    Object.assign(tooltipArrow.style, {
      left: arrowX ? `${arrowX}px` : '',
      top: arrowY ? `${arrowY}px` : '',
      bottom: '-4px',
    })
  })
}

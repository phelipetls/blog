import { computePosition, offset, shift, arrow } from '@floating-ui/dom'

const clipboardIconSvg = `{{ .ClipboardIcon }}`

const tooltip = document.querySelector('[data-theme-copy-code-tooltip]')
const tooltipArrow = document.querySelector(
  '[data-theme-copy-code-tooltip-arrow]'
)

function createCopyCodeButton() {
  const button = document.createElement('button')

  button.className =
    'btn btn-icon p-1 bg-surface text-foreground border border-divider pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 absolute right-4 top-3 transition transition-opacity duration-500'
  button.style = '--icon-size: 24px;'

  button.innerHTML = clipboardIconSvg

  button.addEventListener('click', async function () {
    const codeBlock = button.parentElement.querySelector('pre code')
    await navigator.clipboard.writeText(codeBlock.textContent.trimEnd())

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
      Object.assign(tooltip.style, {
        left: '0px',
        top: '0px',
        animation: '',
      })
    }, 1000)

    const { x: arrowX, y: arrowY } = middlewareData.arrow

    Object.assign(tooltipArrow.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      bottom: '-4px',
    })
  })

  return button
}

function wrapAround(element, parentElement) {
  element.insertAdjacentElement('afterend', parentElement)
  parentElement.append(element)
  return parentElement
}

function hasOnlyCodeBlockAsChild(element) {
  return (
    element.children.length === 1 &&
    element.children[0] instanceof HTMLPreElement
  )
}

const codeBlocks = document.querySelectorAll('pre')

for (const codeBlock of codeBlocks) {
  let codeBlockParent = codeBlock.parentElement

  if (!hasOnlyCodeBlockAsChild(codeBlockParent)) {
    codeBlockParent = wrapAround(codeBlock, document.createElement('div'))
  }

  codeBlockParent.classList.add('relative', 'group')

  const copyCodeButton = createCopyCodeButton()

  codeBlock.append(copyCodeButton)
}

import { computePosition, shift, offset } from '@floating-ui/dom'

export function getOptions(listbox: HTMLElement): NodeListOf<HTMLElement> {
  return listbox.querySelectorAll('[role="option"]')
}

function getActiveDescendant(listbox: HTMLElement): HTMLElement | null {
  let activeDescendant: HTMLElement | null = null

  getOptions(listbox).forEach(function (item) {
    if (item.id === listbox.getAttribute('aria-activedescendant')) {
      activeDescendant = item
    }
  })

  return activeDescendant
}

function getSelectedOption(listbox: HTMLElement): HTMLElement | null {
  let selectedListboxitem: HTMLElement | null = null

  getOptions(listbox).forEach(function (item) {
    if (item.getAttribute('aria-selected') === 'true') {
      selectedListboxitem = item
    }
  })

  return selectedListboxitem
}

const focusedStyle = ['bg-hover']
const selectedStyle = ['text-primary']

function applyFocusedStyle(item: HTMLElement): void {
  item.classList.add(...focusedStyle)
}

function removeFocusedStyle(item: HTMLElement): void {
  item.classList.remove(...focusedStyle)
}

function applySelectedStyle(item: HTMLElement): void {
  item.classList.add(...selectedStyle)
}

function removeSelectedStyle(item: HTMLElement): void {
  item.classList.remove(...selectedStyle)
}

function focusOption(listbox: HTMLElement, targetOption: EventTarget): void {
  getOptions(listbox).forEach(function (option) {
    if (option !== targetOption) {
      removeFocusedStyle(option)
    } else {
      applyFocusedStyle(option)
      listbox.setAttribute('aria-activedescendant', option.id)
    }
  })
}

function selectOption(listbox: HTMLElement, targetItem: EventTarget): void {
  getOptions(listbox).forEach(function (item) {
    if (item === targetItem) {
      item.setAttribute('aria-selected', 'true')
      applySelectedStyle(item)
    } else {
      item.removeAttribute('aria-selected')
      removeSelectedStyle(item)
    }
  })
}

function fadeIn(element: HTMLElement, duration: number): void {
  element.style.transition = `visibility 0s linear, opacity ${duration}ms`
  element.style.pointerEvents = 'auto'
  element.style.opacity = '1'
  element.style.visibility = 'visible'
}

function fadeOut(element: HTMLElement, duration: number): void {
  element.style.transition = `visibility 0s linear ${duration}ms, opacity ${duration}ms`
  element.style.pointerEvents = 'none'
  element.style.opacity = '0'
  element.style.visibility = 'hidden'
}

function showListbox(listbox: HTMLElement, button: HTMLButtonElement): void {
  button.setAttribute('aria-expanded', 'true')

  fadeIn(listbox, 500)
  listbox.focus()

  const selectedListboxItem = getSelectedOption(listbox)
  if (selectedListboxItem) {
    focusOption(listbox, selectedListboxItem)
  }
}

function hideListbox(listbox: HTMLElement, button: HTMLButtonElement): void {
  fadeOut(listbox, 500)

  button.setAttribute('aria-expanded', 'false')
  if (
    document.activeElement === listbox ||
    document.activeElement === getActiveDescendant(listbox)
  ) {
    button.focus()
  }

  listbox.removeAttribute('aria-activedescendant')
}

type InitializeOptions = {
  onClick?: (item: HTMLElement | null) => void
  isSelectedItem?: (item: HTMLElement) => boolean
}

let hideListboxOnBlurTimeout: number

export function initialize(
  button: HTMLButtonElement,
  options: InitializeOptions
): void {
  const listboxId = button.getAttribute('aria-controls')

  if (listboxId === null) {
    return
  }

  const listbox = document.getElementById(listboxId)

  if (!listbox) {
    return
  }

  button.addEventListener('click', async function () {
    clearTimeout(hideListboxOnBlurTimeout)

    if (button.getAttribute('aria-expanded') === 'true') {
      hideListbox(listbox, button)
    } else {
      showListbox(listbox, button)

      const { x, y } = await computePosition(button, listbox, {
        placement: 'bottom',
        middleware: [offset(8), shift({ padding: 16 })],
      })

      Object.assign(listbox.style, {
        left: `${x}px`,
        top: `${y}px`,
      })
    }
  })

  listbox.addEventListener('blur', function () {
    hideListboxOnBlurTimeout = window.setTimeout(function () {
      hideListbox(listbox, button)
    }, 300)
  })

  listbox.addEventListener('click', function (e) {
    if (!e.target) {
      return
    }

    if (options.onClick) {
      options.onClick(getActiveDescendant(listbox))
      selectOption(listbox, e.target)
      hideListbox(listbox, button)
    }

    clearTimeout(hideListboxOnBlurTimeout)
  })

  getOptions(listbox).forEach(function (item) {
    item.addEventListener('mouseover', function () {
      focusOption(listbox, item)
    })
  })

  getOptions(listbox).forEach(function (item) {
    if (item.getAttribute('aria-selected') === 'true') {
      applySelectedStyle(item)
      return
    }

    if (
      typeof options.isSelectedItem === 'function' &&
      options.isSelectedItem(item)
    ) {
      selectOption(listbox, item)
    }
  })

  listbox.addEventListener('keydown', function (e) {
    const activeItem = getActiveDescendant(listbox)

    let nextActiveItem: Element | null = null
    let shouldPreventDefault = false

    switch (e.key) {
      case 'Escape':
        hideListbox(listbox, button)
        shouldPreventDefault = true
        break
      case 'Enter':
      case ' ':
        if (options.onClick) {
          options.onClick(getActiveDescendant(listbox))

          const activeDescendant = getActiveDescendant(listbox)
          if (activeDescendant) {
            selectOption(listbox, activeDescendant)
          }

          hideListbox(listbox, button)
        }
        shouldPreventDefault = true
        break
      case 'ArrowDown':
        nextActiveItem =
          activeItem?.nextElementSibling || listbox.firstElementChild
        break
      case 'ArrowUp':
        nextActiveItem =
          activeItem?.previousElementSibling || listbox.lastElementChild
        break
      case 'Home':
      case 'PageUp':
        nextActiveItem = listbox.firstElementChild
        break
      case 'End':
      case 'PageDown':
        nextActiveItem = listbox.lastElementChild
        break
    }

    if (nextActiveItem) {
      focusOption(listbox, nextActiveItem)
      shouldPreventDefault = true
    }

    if (shouldPreventDefault) {
      e.preventDefault()
    }
  })
}

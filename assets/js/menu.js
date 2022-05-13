// @ts-check
import { computePosition, shift, offset } from '@floating-ui/dom'

/**
 * @type {(menu: HTMLElement) => NodeListOf<HTMLElement>}
 */
export function getMenuItems(menu) {
  return menu.querySelectorAll('[role="menuitem"]')
}

/**
 * @type {(menu: HTMLElement) => HTMLElement}
 */
function getActiveMenuItem(menu) {
  let activeMenuItem

  getMenuItems(menu).forEach(function (item) {
    if (item.id === menu.getAttribute('aria-activedescendant')) {
      activeMenuItem = item
    }
  })

  return activeMenuItem
}

/**
 * @type {(menu: HTMLElement) => HTMLElement}
 */
function getSelectedMenuItem(menu) {
  let selectedMenuitem

  getMenuItems(menu).forEach(function (item) {
    if (item.getAttribute('aria-selected') === 'true') {
      selectedMenuitem = item
    }
  })

  return selectedMenuitem
}

const focusedStyle = ['bg-surface']

/**
 * @type {(item: HTMLElement) => void}
 */
function applyFocusedStyle(item) {
  item.classList.add(...focusedStyle)
}

/**
 * @type {(item: HTMLElement) => void}
 */
function removeFocusedStyle(item) {
  item.classList.remove(...focusedStyle)
}

/**
 * @type {(menu: HTMLElement, targetItem: EventTarget) => void}
 */
function focusMenuItem(menu, targetItem) {
  getMenuItems(menu).forEach(function (item) {
    if (item !== targetItem) {
      removeFocusedStyle(item)
    } else {
      applyFocusedStyle(item)
      menu.setAttribute('aria-activedescendant', item.id)
    }
  })
}

const selectedStyle = ['font-bold', 'text-primary']

/**
 * @type {(item: HTMLElement) => void}
 */
function applySelectedStyle(item) {
  item.classList.add(...selectedStyle)
}

/**
 * @type {(item: HTMLElement) => void}
 */
function removeSelectedStyle(item) {
  item.classList.remove(...selectedStyle)
}

/**
 * @type {(menu: HTMLElement, targetItem: EventTarget) => void}
 */
function selectMenuItem(menu, targetItem) {
  getMenuItems(menu).forEach(function (item) {
    if (item === targetItem) {
      item.setAttribute('aria-selected', 'true')
      applySelectedStyle(item)
    } else {
      item.removeAttribute('aria-selected')
      removeSelectedStyle(item)
    }
  })
}

/**
 * @type {(element: HTMLElement, duration: number) => void}
 */
function fadeIn(element, duration) {
  element.style.transition = `visibility 0s linear, opacity ${duration}ms`
  element.style.pointerEvents = 'auto'
  element.style.opacity = '1'
  element.style.visibility = 'visible'
}

/**
 * @type {(element: HTMLElement, duration: number) => void}
 */
function fadeOut(element, duration) {
  element.style.transition = `visibility 0s linear ${duration}ms, opacity ${duration}ms`
  element.style.pointerEvents = 'none'
  element.style.opacity = '0'
  element.style.visibility = 'hidden'
}

/**
 * @type {(menu: HTMLElement, button: HTMLButtonElement) => void}
 */
function showMenu(menu, button) {
  button.setAttribute('aria-expanded', 'true')

  fadeIn(menu, 500)

  const selectedMenuItem = getSelectedMenuItem(menu)
  if (selectedMenuItem) {
    menu.setAttribute('aria-descendant', selectedMenuItem.id)
    focusMenuItem(menu, selectedMenuItem)
  }

  menu.focus()
}

/**
 * @type {(menu: HTMLElement, button: HTMLButtonElement) => void}
 */
function hideMenu(menu, button) {
  fadeOut(menu, 500)

  button.setAttribute('aria-expanded', 'false')
  if (
    document.activeElement === menu ||
    document.activeElement === getActiveMenuItem(menu)
  ) {
    button.focus()
  }

  menu.removeAttribute('aria-activedescendant')
}

/**
 * @typedef {object} InitializeOptions
 * @property {(item: HTMLElement) => void} onClick
 * @property {(item: HTMLElement) => boolean} isSelectedItem
 */

/**
 * @type {(button: HTMLButtonElement, options: InitializeOptions) => void}
 */
export function initialize(button, options) {
  const menu = document.getElementById(button.getAttribute('aria-controls'))

  button.addEventListener('click', async function () {
    if (button.getAttribute('aria-expanded') === 'true') {
      hideMenu(menu, button)
    } else {
      showMenu(menu, button)

      const { x, y } = await computePosition(button, menu, {
        placement: 'bottom',
        middleware: [offset(8), shift({ padding: 16 })],
      })

      Object.assign(menu.style, {
        left: `${x}px`,
        top: `${y}px`,
      })
    }
  })

  let hideMenuOnBlurTimeout

  menu.addEventListener('focus', function () {})

  menu.addEventListener('blur', function () {
    hideMenuOnBlurTimeout = setTimeout(function () {
      hideMenu(menu, button)
    }, 300)
  })

  menu.addEventListener('click', function (e) {
    if (options.onClick) {
      options.onClick(getActiveMenuItem(menu))
      selectMenuItem(menu, e.target)
      hideMenu(menu, button)
    }

    clearTimeout(hideMenuOnBlurTimeout)
  })

  getMenuItems(menu).forEach(function (item) {
    item.addEventListener('mouseover', function () {
      focusMenuItem(menu, item)
    })
  })

  getMenuItems(menu).forEach(function (item) {
    if (item.getAttribute('aria-selected') === 'true') {
      applySelectedStyle(item)
      return
    }

    if (
      typeof options.isSelectedItem === 'function' &&
      options.isSelectedItem(item)
    ) {
      selectMenuItem(menu, item)
    }
  })

  menu.addEventListener('keydown', function (e) {
    const activeItem = getActiveMenuItem(menu)

    let nextActiveItem
    let shouldPreventDefault

    switch (e.key) {
      case 'Escape':
        hideMenu(menu, button)
        shouldPreventDefault = true
        break
      case 'Enter':
      case ' ':
        if (options.onClick) {
          options.onClick(getActiveMenuItem(menu))
          selectMenuItem(menu, getActiveMenuItem(menu))
          hideMenu(menu, button)
        }
        shouldPreventDefault = true
        break
      case 'ArrowDown':
        nextActiveItem = activeItem.nextElementSibling || menu.firstElementChild
        break
      case 'ArrowUp':
        nextActiveItem =
          activeItem.previousElementSibling || menu.lastElementChild
        break
      case 'Home':
      case 'PageUp':
        nextActiveItem = menu.firstElementChild
        break
      case 'End':
      case 'PageDown':
        nextActiveItem = menu.lastElementChild
        break
    }

    if (nextActiveItem) {
      focusMenuItem(menu, nextActiveItem)
      shouldPreventDefault = true
    }

    if (shouldPreventDefault) {
      e.preventDefault()
    }
  })
}

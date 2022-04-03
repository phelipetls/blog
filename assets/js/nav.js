import throttle from 'lodash.throttle'

const main = document.querySelector('main')
const navContainer = document.querySelector('[data-nav-container]')

let mainEnteredIntoView = false
let navEnteredIntoView = false

const observer = new IntersectionObserver(
  function (entries) {
    const mainEntry = entries.find((entry) => entry.target === main)
    const navContainerEntry = entries.find(
      (entry) => entry.target === navContainer
    )

    mainEnteredIntoView = mainEntry
      ? mainEntry.isIntersecting
      : mainEnteredIntoView

    navEnteredIntoView = navContainerEntry
      ? navContainerEntry.isIntersecting
      : navEnteredIntoView

    if (navEnteredIntoView) {
      navContainer.classList.add('border-b', 'border-divider')
    } else {
      navContainer.classList.remove('border-b', 'border-divider')
    }
  },
  {
    rootMargin: `0px 0px -100% 0px`,
    threshold: [0, 1],
  }
)

observer.observe(navContainer)
observer.observe(main)

let lastScrollPosition = window.scrollY

function hideNav(nav) {
  Object.assign(nav.style, {
    transform: 'translateY(-100%)',
  })
}

function showNav(nav) {
  Object.assign(nav.style, {
    transform: 'translateY(0%)',
  })
}

function handleScroll() {
  const newScrollPosition = window.scrollY

  const isScrollingDown = newScrollPosition > lastScrollPosition
  const navIsInsideMain = mainEnteredIntoView && navEnteredIntoView

  if (isScrollingDown && navIsInsideMain) {
    hideNav(navContainer)
  } else {
    showNav(navContainer)
  }

  lastScrollPosition = Math.max(newScrollPosition, 0)
}

window.addEventListener('scroll', throttle(handleScroll, 300), false)

import throttle from 'lodash.throttle'

const navContainer = document.querySelector('[data-nav-container]')
const navContainerHeight = navContainer.clientHeight

const main = document.querySelector('main')

let hasMainIntersectedTop = false

const observer = new IntersectionObserver(
  function (entries) {
    const entry = entries[0]
    hasMainIntersectedTop = entry.isIntersecting

    if (hasMainIntersectedTop) {
      navContainer.classList.add('border-b', 'border-divider')
    } else {
      navContainer.classList.remove('border-b', 'border-divider')
    }
  },
  {
    rootMargin: '0px 0px -100%',
    threshold: [0, 1],
  }
)

observer.observe(main)

function hideNav(nav) {
  Object.assign(nav.style, {
    top: `-${navContainerHeight}px`,
  })
}

function showNav(nav) {
  Object.assign(nav.style, {
    top: '0px',
  })
}

let lastScrollPosition = window.scrollY

function handleScroll() {
  const newScrollPosition = window.scrollY

  const isScrollingDown = newScrollPosition > lastScrollPosition

  if (isScrollingDown && hasMainIntersectedTop) {
    hideNav(navContainer)
  } else {
    showNav(navContainer)
  }

  lastScrollPosition = Math.max(newScrollPosition, 0)
}

window.addEventListener('scroll', throttle(handleScroll, 300), false)

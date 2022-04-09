const main = document.querySelector('main')
const nav = document.querySelector('[data-nav-container]')

let isNavFullyVisible = false
let isNavVisible = false

const navObserver = new IntersectionObserver(
  function (entries) {
    const entry = entries[0]

    isNavVisible = entry.isIntersecting && entry.intersectionRatio > 0
    isNavFullyVisible = entry.intersectionRatio === 1
  },
  {
    threshold: [0, 1e-4, 1],
  }
)

navObserver.observe(nav)

let isMainIntersectingTop = false

const topObserver = new IntersectionObserver(
  function (entries) {
    const entry = entries[0]

    isMainIntersectingTop = entry.isIntersecting

    if (isMainIntersectingTop) {
      nav.classList.add('border-b', 'border-divider')
    } else {
      nav.classList.remove('border-b', 'border-divider')

      Object.assign(nav.style, {
        position: 'fixed',
        top: '0px',
      })
    }
  },
  {
    rootMargin: '0px 0px -100%',
    threshold: [0, 1],
  }
)

topObserver.observe(main)

let lastScrollPosition = window.scrollY

function hideNav() {
  if (!isMainIntersectingTop) {
    return
  }

  if (isNavFullyVisible) {
    Object.assign(nav.style, {
      position: 'absolute',
      top: `${window.scrollY - 1}px`,
    })
    return
  }

  if (!isNavVisible) {
    Object.assign(nav.style, {
      position: 'fixed',
      top: `-${nav.offsetHeight}px`,
    })
  }
}

function showNav() {
  if (isNavFullyVisible) {
    Object.assign(nav.style, {
      position: 'fixed',
      top: '0px',
    })
    return
  }

  if (!isNavVisible) {
    Object.assign(nav.style, {
      position: 'absolute',
      top: `${window.scrollY - nav.offsetHeight + 1}px`,
    })
  }
}

function setNavPosition() {
  const newScrollPosition = window.scrollY
  const isScrollingDown = newScrollPosition > lastScrollPosition

  const shouldHide = isScrollingDown && isMainIntersectingTop

  if (shouldHide) {
    hideNav()
  } else {
    showNav()
  }

  lastScrollPosition = Math.max(newScrollPosition, 0)
}

let timeout

function handleScroll() {
  if (timeout) {
    window.cancelAnimationFrame(timeout)
  }

  timeout = window.requestAnimationFrame(function () {
    setNavPosition()
  })
}

window.addEventListener('scroll', handleScroll, false)

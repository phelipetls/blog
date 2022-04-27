const nav = document.querySelector('[data-nav-container]')

nav.querySelector('a.active').scrollIntoView()

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

let lastScrollPosition = window.scrollY

function hideNav() {
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

  const shouldHide = isScrollingDown

  if (shouldHide) {
    hideNav()
  } else {
    showNav()
  }

  lastScrollPosition = Math.max(newScrollPosition, 0)
}

function setNavStyle() {
  for (const className of ['border-b', 'border-divider']) {
    nav.classList.toggle(className, window.scrollY > nav.offsetHeight)
  }
}

setNavStyle()

let timeout

function handleScroll() {
  if (timeout) {
    window.cancelAnimationFrame(timeout)
  }

  timeout = window.requestAnimationFrame(function () {
    setNavPosition()
    setNavStyle()
  })
}

window.addEventListener('scroll', handleScroll, false)

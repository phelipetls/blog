const nav = document.querySelector('[data-nav-container]')

nav.querySelector('a.active').scrollIntoView()

let lastScrollPosition = window.scrollY

function setNavPosition() {
  const newScrollPosition = window.scrollY
  const isScrollingDown = newScrollPosition > lastScrollPosition

  if (isScrollingDown) {
    nav.style.top = `-${nav.offsetHeight}px`
  } else {
    nav.style.top = '0'
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

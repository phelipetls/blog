const nav = document.querySelector('[data-nav-container]')

const navActiveLink = nav.querySelector('nav a.active')

if (navActiveLink) {
  navActiveLink.scrollIntoView()
}

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
  for (const className of ['shadow-lg', 'dark:shadow-700']) {
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

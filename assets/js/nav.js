const nav = document.querySelector('[data-nav-container]')

const navActiveLink = nav.querySelector('nav a.active')

if (navActiveLink) {
  navActiveLink.scrollIntoView({
    behavior: 'auto',
    block: 'center',
  })
}

let lastScrollPosition = window.scrollY

function setNavPosition() {
  const newScrollPosition = window.scrollY
  const isScrollingDown = newScrollPosition > lastScrollPosition

  if (isScrollingDown) {
    nav.style.transform = `translateY(-100%)`
  } else {
    nav.style.transform = `translateY(0)`
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

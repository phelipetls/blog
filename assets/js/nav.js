const nav = document.querySelector('[data-nav-container]')

const activeNavLink = nav.querySelector('[data-active-navlink]')

if (activeNavLink) {
  activeNavLink.scrollIntoView({
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

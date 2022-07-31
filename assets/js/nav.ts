const nav = document.querySelector('[data-nav-container]') as HTMLDivElement

const activeNavLink = nav.querySelector('[aria-current=page]')

if (activeNavLink) {
  activeNavLink.scrollIntoView({
    behavior: 'auto',
    block: 'center',
  })
}

const visibleNavStyle = ['shadow-md', 'shadow-shadow']

function hideNav() {
  nav.style.transform = `translateY(-100%)`
  nav.classList.remove(...visibleNavStyle)
}

function showNav() {
  nav.style.transform = `translateY(0)`
  nav.classList.add(...visibleNavStyle)
}

let timeout: number
let lastScrollPosition = window.scrollY

function handleScroll() {
  if (timeout) {
    window.cancelAnimationFrame(timeout)
  }

  const newScrollPosition = window.scrollY
  const isScrollingDown = newScrollPosition > lastScrollPosition

  timeout = window.requestAnimationFrame(function () {
    if (isScrollingDown) {
      hideNav()
    } else {
      showNav()
    }

    lastScrollPosition = Math.max(newScrollPosition, 0)
  })
}

window.addEventListener('scroll', handleScroll, false)

export {}

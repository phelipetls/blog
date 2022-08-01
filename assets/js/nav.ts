const nav = document.querySelector('[data-nav-container]') as HTMLDivElement

const activeNavLink = nav.querySelector('[aria-current=page]')

if (activeNavLink) {
  activeNavLink.scrollIntoView({
    behavior: 'auto',
    block: 'center',
  })
}

function hideNav() {
  nav.style.transform = `translateY(-100%)`
  hideNavShadow()
}

function showNav() {
  nav.style.transform = `translateY(0)`
  showNavShadow()
}

function showNavShadow() {
  nav.style.setProperty('--shadow-opacity', '100')
}

function hideNavShadow() {
  nav.style.setProperty('--shadow-opacity', '0')
}

function handleNavShadowVisibility() {
  if (window.scrollY <= nav.clientHeight) {
    hideNavShadow()
  } else {
    showNavShadow()
  }
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

    handleNavShadowVisibility()

    lastScrollPosition = Math.max(newScrollPosition, 0)
  })
}

handleNavShadowVisibility()
window.addEventListener('scroll', handleScroll, false)

export {}

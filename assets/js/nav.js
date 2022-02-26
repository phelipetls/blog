import throttle from 'lodash.throttle'

const navContainer = document.querySelector('[data-nav-container]')

let navIsStuck = false

const observer = new IntersectionObserver(
  function (entries) {
    const entry = entries[0]

    navIsStuck = entry.isIntersecting

    if (entry.isIntersecting) {
      entry.target.classList.add('shadow', 'shadow-divider')
    } else {
      entry.target.classList.remove('shadow', 'shadow-divider')
    }
  },
  {
    rootMargin: '0px 0px -100% 0px',
    threshold: 0,
  }
)

observer.observe(navContainer)

let lastScrollPosition = window.scrollY

function handleScroll() {
  const newScrollPosition = window.scrollY

  const isScrollingDown = newScrollPosition > lastScrollPosition

  if (isScrollingDown && navIsStuck) {
    navContainer.style.transform = `translateY(-100%)`
    navContainer.classList.add('!shadow-none')
  } else {
    navContainer.style.transform = `translateY(0%)`
    navContainer.classList.remove('!shadow-none')
  }

  lastScrollPosition = Math.max(newScrollPosition, 0)
}

window.addEventListener('scroll', throttle(handleScroll, 300), false)

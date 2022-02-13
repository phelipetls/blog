const navContainer = document.querySelector('.nav-container')

let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop
let lastScrollDirection = 0

function handleScroll() {
  const newScrollTop = window.pageYOffset || document.documentElement.scrollTop

  const scrollDirection = Math.sign(newScrollTop - lastScrollTop)

  if (scrollDirection !== lastScrollDirection) {
    if (scrollDirection === 1) {
      navContainer.classList.add('is-scrolling-down')
    } else if (scrollDirection === -1) {
      navContainer.classList.remove('is-scrolling-down')
    }
  }

  lastScrollTop = Math.max(newScrollTop, 0)
}

window.addEventListener('scroll', handleScroll)

const observer = new IntersectionObserver(
  function ([e]) {
    e.target.classList.toggle('stuck', e.intersectionRatio < 1)
  },
  { rootMargin: '-1px 0px 0px 0px', threshold: [1] }
)

observer.observe(navContainer)

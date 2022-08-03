const nav = document.querySelector('[data-nav-container]') as HTMLDivElement

const activeNavLink = nav.querySelector('[aria-current=page]')

if (activeNavLink) {
  activeNavLink.scrollIntoView({
    behavior: 'auto',
    block: 'center',
  })
}

export {}

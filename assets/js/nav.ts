const nav = document.querySelector<HTMLDivElement>('[data-nav-container]')
const activeNavLink = nav?.querySelector('[aria-current=page]')

if (activeNavLink) {
  activeNavLink.scrollIntoView({
    behavior: 'auto',
    block: 'center',
  })
}

export {}

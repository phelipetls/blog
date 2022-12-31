const cartesianProduct = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))

describe('Navbar', () => {
  cartesianProduct(
    ['macbook-11', 'iphone-6'],
    ['pt', 'en'],
    ['/', '/posts', '/projects', '/resume']
  ).forEach(([viewport, lang, pathname]) => {
    const language = lang === 'pt' ? 'portuguese' : 'english'

    it(`should highlight link to ${pathname} in nav navbar correctly (in ${language} and ${viewport})`, () => {
      cy.viewport(viewport)

      const urlPrefix = lang === 'pt' ? '/pt' : ''
      cy.visit(urlPrefix + pathname)

      if (viewport === 'iphone-6') {
        cy.findByTestId('open-sidenav').click()
      }

      cy.findByRole('navigation', {
        name: lang === 'pt' ? /navegação principal/i : /main navigation/i,
      }).within(() => {
        cy.findAllByRole('link').each(($link) => {
          if ($link.attr('href') === urlPrefix + pathname) {
            expect($link).to.have.attr('aria-current', 'page')
            expect($link).to.have.class('bg-primary')
          } else {
            expect($link).not.to.have.attr('aria-current')
            expect($link).not.to.have.class('bg-primary')
          }
        })
      })
    })
  })
})

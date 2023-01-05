const cartesianProduct = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))

describe('Navbar', { retries: { runMode: 5, openMode: 0 } }, () => {
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
  ;[
    ['/posts', '/'],
    ['/posts/demystifying-git-rebase/', '/posts/'],
  ].forEach(([url, parentUrl]) => {
    it('should have correct link to parent url in mobile navbar', () => {
      cy.viewport('iphone-6')

      cy.visit(url)
      cy.findByTestId('parent-page-link').should('have.attr', 'href', parentUrl)
    })
  })
})

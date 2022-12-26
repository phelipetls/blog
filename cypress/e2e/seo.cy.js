describe('SEO', () => {
  ;['en', 'pt'].forEach((lang) => {
    it(`blog post should have open graph/twitter cards meta tags for images (in ${lang})`, () => {
      cy.visit(`/${lang === 'pt' ? 'pt/' : ''}posts/demystifying-git-rebase`)

      cy.get('head meta[property="og:image"]')
        .invoke('attr', 'content')
        .then(cy.request)

      cy.get('head meta[name="twitter:image"]')
        .invoke('attr', 'content')
        .then(cy.request)

      cy.get('head meta[name="twitter:card"]').should(
        'have.attr',
        'content',
        'summary_large_image'
      )
    })
  })
})

describe('SEO', () => {
  ;['en', 'pt'].forEach((lang) => {
    it(`should contain valid open graph/twitter cards meta tags for posts images in ${lang}`, () => {
      let postImageFilenameRegex

      if (lang === 'en') {
        cy.visit('/posts/demystifying-git-rebase/')
        postImageFilenameRegex = /post-image\.png$/
      } else {
        cy.visit('/pt/posts/demystifying-git-rebase/')
        postImageFilenameRegex = /post-image\.pt\.png$/
      }

      cy.get('head meta[name="twitter:image"]')
        .should('have.attr', 'content')
        .should('match', postImageFilenameRegex)

      cy.get('head meta[name="twitter:card"]').should(
        'have.attr',
        'content',
        'summary_large_image'
      )

      cy.get('head meta[property="og:image"]')
        .should('have.attr', 'content')
        .should('match', postImageFilenameRegex)
        .then(cy.request)
    })
  })
})

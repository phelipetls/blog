const viewports = ['macbook-11', 'iphone-6']

describe('Multi-language listbox', () => {
  viewports.forEach((viewport) => {
    it(`should be able to select multiple languages in ${viewport}`, () => {
      cy.viewport(viewport)

      cy.visit('/')

      cy.get(':root').should('have.attr', 'lang', 'en')

      if (viewport === 'iphone-6') {
        cy.get('button[aria-label="open navigation sidebar" i]').click()
      }
      cy.findByRole('link', { name: /ler em português/i }).click()

      cy.url().should('contain', 'pt')
      cy.get(':root').should('have.attr', 'lang', 'pt-BR')

      if (viewport === 'iphone-6') {
        cy.findByRole('button', {
          name: /abrir barra de navegação lateral/i,
        }).click()
      }
      cy.findByRole('link', { name: /read in english/i }).click()

      cy.url().should('not.contain', 'pt')
      cy.get(':root').should('have.attr', 'lang', 'en')
    })
  })

  const pagesWithTranslations = [
    '/',
    '/posts',
    '/projects',
    '/resume',
    '/posts/demystifying-git-rebase/',
  ]

  pagesWithTranslations.forEach((pageUrl) => {
    it(`should have language link in page ${pageUrl}`, () => {
      cy.visit(pageUrl)

      cy.findByRole('link', {
        name: /ler em português/i,
      }).should('exist')
    })
  })
})

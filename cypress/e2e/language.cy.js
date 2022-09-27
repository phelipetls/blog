describe('Multi-language', () => {
  it('should be able to select multiple languages in desktop', () => {
    cy.viewport('macbook-11')
    cy.visit('/')

    cy.get(':root').should('have.attr', 'lang', 'en')

    cy.findByRole('link', { name: /ler em português/i }).click()
    cy.url().should('contain', 'pt')
    cy.get(':root').should('have.attr', 'lang', 'pt-BR')

    cy.findByRole('link', { name: /read in english/i }).click()
    cy.url().should('not.contain', 'pt')
    cy.get(':root').should('have.attr', 'lang', 'en')
  })

  it(
    'should be able to select multiple languages in mobile',
    { retries: { runMode: 2, openMode: 0 } },
    () => {
      cy.viewport('iphone-6')
      cy.visit('/')

      cy.get(':root').should('have.attr', 'lang', 'en')

      cy.findByRole('button', { name: /open navigation sidebar/i }).click()
      cy.findByRole('link', { name: /ler em português/i }).click()
      cy.url().should('contain', 'pt')
      cy.get(':root').should('have.attr', 'lang', 'pt-BR')

      cy.findByRole('button', {
        name: /abrir barra de navegação lateral/i,
      }).click()
      cy.findByRole('link', { name: /read in english/i }).click()
      cy.url().should('not.contain', 'pt')
      cy.get(':root').should('have.attr', 'lang', 'en')
    }
  )

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

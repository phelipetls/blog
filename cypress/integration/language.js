describe('Multi-language menu', () => {
  it('should be able to select multiple languages', () => {
    cy.visit('/')

    cy.get(':root').should('have.attr', 'lang', 'en')

    cy.findByRole('menu', { name: /translations/i }).should('not.exist')
    cy.findByRole('button', {
      name: /click to read in another language/i,
    }).click()
    cy.findByRole('menu', { name: /translations/i }).should('be.visible')
    cy.findByRole('menuitem', { name: /Português/i }).click()

    cy.url().should('contain', 'pt')
    cy.get(':root').should('have.attr', 'lang', 'pt-BR')

    cy.findByRole('button', {
      name: /clique para ler em outra linguagem/i,
    }).click()
    cy.findByRole('menuitem', { name: /English/i }).click()

    cy.url().should('not.contain', 'pt')
    cy.get(':root').should('have.attr', 'lang', 'en')
  })
})

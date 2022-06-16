describe('Multi-language listbox', () => {
  it('should be able to select multiple languages', () => {
    cy.visit('/')

    cy.get(':root').should('have.attr', 'lang', 'en')

    cy.findByRole('listbox', { name: /translations/i }).should('not.exist')
    cy.findByRole('button', {
      name: /click to read in another language/i,
    }).click()
    cy.findByRole('listbox', { name: /translations/i }).should('be.visible')
    cy.findByRole('option', { name: /Português/i }).click()

    cy.url().should('contain', 'pt')
    cy.get(':root').should('have.attr', 'lang', 'pt-BR')

    cy.findByRole('button', {
      name: /clique para ler em outra linguagem/i,
    }).click()
    cy.findByRole('option', { name: /English/i }).click()

    cy.url().should('not.contain', 'pt')
    cy.get(':root').should('have.attr', 'lang', 'en')
  })
})

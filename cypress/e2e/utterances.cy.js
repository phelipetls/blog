describe('Utterances', () => {
  it('should show loading indicator before utterances script loads', () => {
    cy.intercept('**/client.js', async (req) => {
      await Cypress.Promise.delay(1000)
      return req.continue()
    }).as('utterancesScript')

    cy.visit('/posts/code-formatting-vim/')

    cy.wait('@utterancesScript')
    cy.get('[data-utterances-loading]').should('not.exist')
  })
})

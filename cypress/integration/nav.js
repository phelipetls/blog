describe('Main navigation bar', () => {
  beforeEach(() => {
    cy.viewport('iphone-8')
  })

  it('should be hidden when scrolling down and visible when scrolling up', () => {
    cy.visit('/')

    cy.get('[data-nav-container]').should('be.visible')

    cy.scrollTo('bottom')
    cy.get('[data-nav-container]').should('not.be.visible')

    cy.scrollTo('center')
    cy.get('[data-nav-container]').should('be.visible')
  })
})

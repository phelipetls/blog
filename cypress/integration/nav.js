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

  it('should have shadow when scrolling up and based on scroll position', () => {
    cy.visit('/posts')
    cy.get('[data-nav-container]').should('not.have.class', 'shadow-md')

    cy.scrollTo('bottom', { duration: 500 })
    cy.get('[data-nav-container]').should('not.have.class', 'shadow-md')

    cy.scrollTo('center', { duration: 500 })
    cy.get('[data-nav-container]').should('have.class', 'shadow-md')

    // Test if the navbar still have a shadow if the initial scroll position is
    // at the center
    cy.reload()
    cy.get('[data-nav-container]').should('have.class', 'shadow-md')

    cy.scrollTo('top', { duration: 500 })
    cy.get('[data-nav-container]').should('not.have.class', 'shadow-md')
  })
})

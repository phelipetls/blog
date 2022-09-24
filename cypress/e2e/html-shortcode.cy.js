describe('HTML shortcode', () => {
  it('the example using details and summary element in vanilla JS should work', () => {
    cy.visit('/posts/surprising-react-bug/')

    cy.get(
      'iframe[title*="the same bug observed when using details element can be reproduced with vanilla javascript" i]'
    )
      .its('0.src')
      .then(cy.visit)

    cy.get('details').should('not.have.attr', 'open')
    cy.contains('State: closed')

    cy.contains('Summary').click()
    // This is the bug
    cy.get('details').should('not.have.attr', 'open')
    cy.contains('State: open')

    cy.contains('Summary').click()
    cy.get('details').should('have.attr', 'open')
    cy.contains('State: closed')
  })
})

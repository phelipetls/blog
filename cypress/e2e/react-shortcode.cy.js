describe('React shortcode', () => {
  it('the example using details and summary element (with preventDefault) should work', () => {
    cy.visit('/posts/surprising-react-bug/')

    cy.get(
      'iframe[title*="fixed bug when using details element with react, using preventdefault" i]'
    )
      // The subject is a jQuery element, which has the real DOM element under property "0"
      .its('0.src')
      .then(cy.visit)

    cy.get('details').should('not.have.attr', 'open')
    cy.contains('State: closed')

    cy.contains('Summary').click()
    cy.get('details').should('have.attr', 'open')
    cy.contains('State: open')

    cy.contains('Summary').click()
    cy.get('details').should('not.have.attr', 'open')
    cy.contains('State: closed')
  })

  it('the example using react-hook-form should work', () => {
    cy.visit('/posts/how-not-to-write-forms-in-react/')

    cy.get('iframe[title*="example of a form using react-hook-form" i]')
      .its('0.src')
      .then(cy.visit)

    cy.contains('Name').click().type('Phelipe')
    cy.contains('Age').click().type('26')

    cy.window().then((win) => {
      cy.spy(win, 'alert').as('spyAlert')
    })

    cy.contains('Submit').click()

    cy.get('@spyAlert').should(
      'be.called.with',
      JSON.stringify({
        name: 'Phelipe',
        age: 26,
      })
    )
  })
})

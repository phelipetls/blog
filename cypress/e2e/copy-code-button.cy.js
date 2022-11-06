describe('Copy code button', () => {
  it(
    'should copy code block contents with the click of a button',
    { browser: 'electron' },
    () => {
      cy.visit('/posts/bash-for-javascript-developers')

      cy.findByRole('tooltip', { name: 'Copied' }).should('not.exist')

      cy.findAllByRole('button', { name: /copy code/i })
        .first()
        .focus()
        .click()

      cy.contains('Copied').should('exist')
      cy.contains('Copied').should('not.exist')
    }
  )
})

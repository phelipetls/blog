describe('Copy code button', () => {
  it(
    'should copy code block contents with the click of a button',
    { browser: 'electron' },
    () => {
      cy.visit('/posts/bash-for-javascript-developers')

      cy.contains('Copied').should('not.be.visible')

      cy.contains('[data-codeblock]', 'Hello World')
        .first()
        .within(() => {
          cy.get('button[aria-label="Copy code"]').focus().click()
        })

      cy.contains('Copied').should('be.visible')

      cy.window()
        .its('navigator.clipboard')
        .invoke('readText')
        .should('equal', 'echo Hello World')

      cy.contains('Copied').should('not.be.visible')
    }
  )
})

describe('Table of contents interactive sidebar', () => {
  it('should highlight toc item when its corresponding heading comes into view', () => {
    cy.viewport('macbook-11')

    cy.visit('/posts/bash-for-javascript-developers')

    cy.contains('h2', 'Quoting and whitespace').scrollIntoView()

    cy.get('nav[data-toc] li a[href="#quoting-and-whitespace"]')
      .closest('li')
      .should('have.attr', 'data-active')
  })

  it('should scroll to make toc item visible when its corresponding heading comes into view', () => {
    cy.viewport('macbook-11')

    cy.visit('/posts/bash-for-javascript-developers')

    cy.get('nav[data-toc] a[href="#conclusion"]').should('not.be.inViewport')
    cy.scrollTo('bottom', { easing: 'linear', duration: 100 })
    cy.get('nav[data-toc] a[href="#conclusion"]').should('be.inViewport')

    cy.get('nav[data-toc] a[href="#redirections"]').should('not.be.inViewport')
    cy.contains('h2', 'Redirections').scrollIntoView()
    cy.get('nav[data-toc] a[href="#redirections"]')
      .should('be.inViewport')
      .parent()
      .should('have.attr', 'data-active')

    cy.scrollTo('top', { easing: 'linear', duration: 100 })
    cy.get('nav[data-toc] a[href="#hello-world"]')
      .should('be.inViewport')
      .parent()
      .should('have.attr', 'data-active')
  })
})

describe('Table of contents interactive sidebar', () => {
  it('should highlight toc item when its corresponding heading comes into view', () => {
    cy.viewport('macbook-11')

    cy.visit('/posts/bash-for-javascript-developers')

    cy.contains('h2', /variables/i).scrollIntoView()

    cy.get('nav[data-toc] li a[href="#variables"]')
      .closest('li')
      .should('have.attr', 'data-active')
  })

  it('should scroll to make toc item visible when its corresponding heading comes into view', () => {
    cy.viewport('macbook-11')

    cy.visit('/posts/bash-for-javascript-developers')

    cy.scrollTo('bottom')
    cy.isInViewport('nav[data-toc] li a[href="#conclusion"]')

    cy.contains('h2', /functions/i).scrollIntoView()
    cy.isInViewport('nav[data-toc] li a[href="#functions"]')

    cy.scrollTo('top')
    cy.isInViewport('nav[data-toc] li a[href="#hello-world"]')
  })
})

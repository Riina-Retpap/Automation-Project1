beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
describe(' Visual tests', () => {
    
    it('Check that radio button list for getting lewsletter is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never')
    })

    it('Check that Country dropdown is correct', () => {
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').eq(0).should('have.text', '')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')
    })

    it('Check that Spain - city dropdown is correct', () => {
        cy.get('#country').select('Spain')
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Malaga')
        cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')
        cy.get('#city').find('option').eq(3).should('have.text', 'Valencia')
        cy.get('#city').find('option').eq(4).should('have.text', 'Corralejo')
    })

    it('Check Estonia - city array', () => {
        cy.get('#country').select('Estonia')
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['', 'string:Tallinn', 'string:Haapsalu', 'string:Tartu',])
        })
    })

    it('Check Austria - city array', () => {
        cy.get('#country').select('Austria')
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['', 'string:Vienna', 'string:Salzburg', 'string:Innsbruck',])
        })
    })

    it('Check that chosen city is removed when country is changed', () => {
        cy.get('#country').select('Austria')
        cy.get('#city').select('Vienna')
        cy.get('#country').select('Spain')
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['', 'string:Malaga', 'string:Madrid', 'string:Valencia', 'string:Corralejo'])
        })
    })

    it('Check that cookiePolicy link works', () => {
        cy.get('button').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'cookiePolicy.html')
            .click()
        cy.url().should('contain', '/cookiePolicy.html')
        cy.go('back')
        cy.log('Back again in registration form 3')
    })

    it('Check that check boxes are correct', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)
        cy.get('input[type="checkbox"]').next().eq(0).should('have.text', '')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text', 'Accept our cookie policy')
    })
})

describe(' Functional tests', () => {
    it('User can submit query with all fields added', () => {
        inputValidData('Wooden@Shoes.ee')
        cy.get('#name').type('Mona')
        cy.get('[type="date"]').eq(0).type('2023-01-02')
        cy.get('#birthday').type('1999-01-02')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked').should('have.value', 'Weekly')
        cy.get('[type="submit"]').should('be.enabled')
        cy.get('[type="submit"]').eq(1).click()
        cy.get('h1').contains('Submission received')
    })
    it('User can submit query with mandatory fields added', () => {
        inputValidData('Wooden@Shoes.ee')
        cy.get('[type="submit"]').should('be.enabled')
        cy.get('[type="submit"]').eq(1).click()
        cy.get('h1').contains('Submission received')
    })
    it('User can not submit query without country', () => {
        inputValidData('Wooden@Shoes.ee')
        cy.get('#country').scrollIntoView()
        cy.get('#country').select('')
        cy.get('h2').contains('Birthday').click()
        cy.get('[type="submit"]').eq(1).should('not.be.enabled')
    })
})

function inputValidData(email) {
    cy.log('email will be filled')
    cy.get('[name="email"]').type(email)
    cy.get('#country').select('Austria')
    cy.get('#city').select('Vienna')
    cy.get('input[type="checkbox"]').eq(0).should('have.text', '').check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(1).should('have.text', '').check().should('be.checked')
    cy.get('h2').contains('Birthday').click()
}

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */
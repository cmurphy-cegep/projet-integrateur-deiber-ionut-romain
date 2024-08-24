/*
describe('Add comment', function() {
    before(function (browser) {
        browser
            .navigateTo('http://localhost:5173/login')
            .waitForElementVisible('form', 1000) // Wait for the form to be visible
            .setValue('input#username', 'don_corleone')
            .setValue('input#password', '12345')
            .click('button.connection-button')
            .waitForElementVisible('div.connexion > div > div:nth-child(1)', 1000, function(result) {
                if (result.value) {
                    browser
                        .assert.textContains('div.connexion > div > div:nth-child(1)', 'Bienvenue, Vito Andolini Corleone')
                        .assert.textContains('div.connexion > div > div:nth-child(2) > a', 'Déconnexion');
                } else {
                    browser
                        .navigateTo('http://localhost:5173/signup')
                        .waitForElementVisible('#app > div > form', 1000) // Wait for the form to be visible
                        .setValue('input#username', 'don_corleone')
                        .setValue('input#password', '12345')
                        .setValue('input#confirmPassword', '12345')
                        .setValue('input#fullName', 'Vito Andolini Corleone')
                        .click('#app > div > form > button')
                        .waitForElementVisible('button.connection-button', 1000)
                        .setValue('input#username', 'don_corleone')
                        .setValue('input#password', '12345')
                        .click('button.connection-button')
                        .waitForElementVisible('div.connexion > div > div:nth-child(1)', 1000)
                        .assert.textContains('div.connexion > div > div:nth-child(1)', 'Bienvenue, Vito Andolini Corleone')
                        .assert.textContains('div.connexion > div > div:nth-child(2) > a', 'Déconnexion');
                }
            });
    });
    it('adds a comment to the recipe', function(browser) {
        browser
            .click('#recipe-list > div:nth-child(1) > div.recipe-name > a')
            .waitForElementVisible('#app > div > div:nth-child(6) > div.recipe-add-comment > button', 1000)
            .assert.textContains('#app > div > div:nth-child(6) > div.recipe-add-comment > button', 'Ajouter un commentaire')
            .click('#app > div > div:nth-child(6) > div.recipe-add-comment > button')
            .waitForElementVisible('#app > div > div:nth-child(6) > div.recipe-add-comment > form', 1000)
            .setValue('#app > div > div:nth-child(6) > div.recipe-add-comment > form > textarea', 'I will make you an offer you can\'t refuse')
            .click('#app > div > div:nth-child(6) > div.recipe-add-comment > form > button')
            .waitForElementVisible('#app > div > div:nth-child(6) > div.recipe-comments > div:nth-child(2) > p:nth-child(2)', 1000)
            .assert.textContains('#app > div > div:nth-child(6) > div.recipe-comments > div:nth-child(2) > p:nth-child(2)', 'I will make you an offer you can\'t refuse');

    });
    after(function (browser) {
        browser.end();
    });
});*/

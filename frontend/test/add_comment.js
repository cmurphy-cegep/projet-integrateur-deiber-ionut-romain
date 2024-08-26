describe('Add comment', function() {
    before(function (browser) {
        browser
            .navigateTo('http://localhost:5173/login')
            .setValue('input#username', 'josbleau')
            .setValue('input#password', '12345')
            .click('#app > div > form > button')
            .waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(1)', 5000)
            .assert.textContains('#app > header > div > div.connexion > div > div:nth-child(1)', 'Bienvenue, Jos Bleau')
            .waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(2) > a', 5000)
            .assert.textContains('#app > header > div > div.connexion > div > div:nth-child(2) > a', 'Déconnexion');
    });
    it('add a comment to the recipe and after that the comment should be displayed', function(browser) {
        browser
            .click('#recipe-list > div:nth-child(1) > div.recipe-name > a')
            .waitForElementVisible('#app > div > div:nth-child(6) > div.recipe-add-comment > button', 1000)
            .assert.textContains('#app > div > div:nth-child(6) > div.recipe-add-comment > button', 'Ajouter un commentaire')
            .click('#app > div > div:nth-child(6) > div.recipe-add-comment > button')
            .waitForElementVisible('#app > div > div:nth-child(6) > div.recipe-add-comment > form', 1000)
            .setValue('#app > div > div:nth-child(6) > div.recipe-add-comment > form > textarea', 'Jos Bleau is the best')
            .click('#app > div > div:nth-child(6) > div.recipe-add-comment > form > button')
            .assert.textContains('#app > div > div:nth-child(6) > div.recipe-comments > div:nth-child(2) > p:nth-child(2)', 'Jos Bleau is the best');

    });
    after(function (browser) {
        browser.end();
    });
});

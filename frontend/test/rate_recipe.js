describe('Rate Recipe', function() {
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
    it('should rating user display after user rate a recipe', function(browser) {
        browser
            .click('#recipe-list > div:nth-child(1) > div.recipe-name > a')
            .waitForElementVisible('#app > div > div:nth-child(5) > div > div:nth-child(2) > button', 1000)
            .assert.textContains('#app > div > div:nth-child(5) > div > div:nth-child(2) > button', 'Ajouter votre appréciation')
            .click('#app > div > div:nth-child(5) > div > div:nth-child(2) > button')
            .waitForElementVisible('#app > div > div:nth-child(5) > div > div:nth-child(2) > form', 1000)
            .setValue('#rating', '5')
            .click('#app > div > div:nth-child(5) > div > div:nth-child(2) > form > button')
            .waitForElementVisible('#app > div > div:nth-child(5) > div > div:nth-child(2) > span', 1000)
            .assert.textContains('#app > div > div:nth-child(5) > div > div:nth-child(2) > span', 'Votre appréciation: 5')
            .waitForElementVisible('#app > div > div:nth-child(5) > div > div:nth-child(2) > button', 1000)
            .assert.textContains('#app > div > div:nth-child(5) > div > div:nth-child(2) > button', 'Modifier votre appréciation');
    });
    after(function (browser) {
        browser.end();
    });
});

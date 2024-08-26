describe('Edit comment', function() {
    before(function (browser) {
        browser
            .navigateTo('http://localhost:5173/login');
    });

    it('edits a description of the recipe', function(browser) {
        browser
            .setValue('input#username', 'admin')
            .setValue('input#password', 'topsecret')
            .click('button.connection-button')
            .click('#recipe-list > div:nth-child(1) > div.recipe-name > a')
            .waitForElementVisible('#app > div > button', 1000)
            .assert.textContains('#app > div > button', 'Éditer')
            .click('#app > div > button')
            .waitForElementVisible('#recipe-desc', 1000)
            .setValue('#recipe-desc', 'Cette recette n\'a pas besoin d\'être décrite. L\'image parle d\'elle-même.')
            .click('#app > div > form > button')
            .waitForElementVisible('#app > div > div:nth-child(3) > div.recipe-description', 1000)
            .assert.textContains('#app > div > div:nth-child(3) > div.recipe-description', 'Cette recette n\'a pas besoin d\'être décrite. L\'image parle d\'elle-même.');
    });

    after(function (browser) {
        browser.end();
    });
});
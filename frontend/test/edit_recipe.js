describe('Edit comment', function () {
	before(function (browser) {
		browser
			.navigateTo('http://localhost:5173/login')
			.setValue('input#username', 'admin')
			.setValue('input#password', 'topsecret')
			.click('button.connection-button')
			.click('#recipe-list > div:nth-child(1) > div.recipe-name > a')
			.waitForElementVisible('#app > div > button', 1000)
			.click('#app > div > button')
			.waitForElementVisible('#recipe-desc', 1000);
	});

	it('edits a description of the recipe', function (browser) {
		const description = `Cette recette n'a pas besoin d'être décrite. L'image parle d'elle-même.`;
		const expectedDescription = description;

		browser
			.setValue('#recipe-desc', description)
			.click('#app > div > form > button')
			.waitForElementVisible('#app > div > div:nth-child(3) > div.recipe-description', 1000)
			.assert.textContains('#app > div > div:nth-child(3) > div.recipe-description', expectedDescription);
	});

	after(function (browser) {
		browser.end();
	});
});
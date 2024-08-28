import { login } from './tools_tests.js';
describe('Edit recipe', function () {
	before(function (browser) {
		login(browser, 'admin', 'topsecret');
		browser
			.click('#recipe-list > div:nth-child(1) > div > div.recipe-name > a')
			.waitForElementVisible('#app > div > button', 1000)
			.click('#app > div > button')
			.waitForElementVisible('#recipe-desc', 1000);
	});

	it('edit a description of the recipe', function (browser) {
		const description = `Cette recette n'a pas besoin d'être décrite.\nL'image parle d'elle-même.`;
		const expectedDescription = description;

		browser
			.setValue('#recipe-desc', description)
			.click('#app > div > form > fieldset > button')
			.waitForElementVisible('#app > div > div:nth-child(2) > div.container-description > div.recipe-description', 1000)
			.assert.textContains('#app > div > div:nth-child(2) > div.container-description > div.recipe-description', expectedDescription);
	});

	after(function (browser) {
		browser.end();
	});
});

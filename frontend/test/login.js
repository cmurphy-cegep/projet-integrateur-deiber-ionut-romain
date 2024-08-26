describe('User login', function () {
	before(function (browser) {
		browser.navigateTo('http://localhost:5173/login');
	});

	it('should login josbleau and password 12345', function (browser) {
		browser
			.setValue('input#username', 'josbleau')
			.setValue('input#password', '12345')
			.click('#app > div > form > button')
			.waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(1)', 5000)
			.assert.textContains('#app > header > div > div.connexion > div > div:nth-child(1)', 'Bienvenue, Jos Bleau')
			.waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(2) > a', 5000)
			.assert.textContains('#app > header > div > div.connexion > div > div:nth-child(2) > a', 'Déconnexion');
	});

	after(function (browser) {
		browser.end();
	});
});

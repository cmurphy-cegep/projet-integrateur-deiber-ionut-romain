export function login(browser, username, password) {
    browser
        .navigateTo('http://localhost:5173/login')
        .setValue('input#username', username)
        .setValue('input#password', password)
        .click('#app > div > form > button');

}

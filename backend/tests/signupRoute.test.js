const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/queries/userAccountQueries');
const userAccountQueries = require('../src/queries/userAccountQueries');

describe('Test signup route', () => {
	it('with inexistant username should return code 400', async () => {
		const bodyReq = {
			username: null,
			password: 'password',
			fullname: 'fullname'
		};

		return request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(400)
			.then(response => {
				expect(response.body.message).toEqual('Le champ username est requis');
			});
	});
	it('with inexistant password should return code 400', async () => {
		const bodyReq = {
			username: 'userId',
			password: null,
			fullname: 'fullname'
		};

		return request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(400)
			.then(response => {
				expect(response.body.message).toEqual('Le champ password est requis');
			});
	});
	it('with inexistant fullname should return code 400', async () => {
		const bodyReq = {
			username: 'userId',
			password: 'password',
			fullname: null
		};
		return request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(400)
			.then(response => {
				expect(response.body.message).toEqual('Le champ fullname est requis');
			});
	});
	it('with successful signup should return user information in json with code 200', () => {
		const userId = 'userId';
		const password = 'motdepasse';
		const fullname = 'fullname';

		const bodyReq = {
			username: userId,
			password: password,
			fullname: fullname
		};

		const mockUserDetails = {
			userId: userId,
			fullName: fullname,
			isAdmin: false
		};
		const expectUserDetails = mockUserDetails;

		userAccountQueries.createUserAccount.mockResolvedValue(mockUserDetails);

		return request(app)
			.post('/signup')
			.send(bodyReq)
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				expect(response.body).toEqual(expectUserDetails);
			});
	});
});
const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/queries/userAccountQueries');
const userAccountQueries = require('../../src/queries/userAccountQueries');

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
			fullname: fullname,
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
	it('with unavailable username should return code 409', () => {
		const bodyReq = {
			username: 'userId',
			password: 'password',
			fullname: 'fullname'
		};

		userAccountQueries.createUserAccount.mockResolvedValue(undefined);

		return request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(409)
			.then(response => {
				expect(response.body.message).toEqual('Le username n\'est pas disponible');
			});
	});
	it('should return code 500 if query fails', () => {
		const bodyReq = {
			username: 'userId',
			password: 'password',
			fullname: 'fullname'
		};
		userAccountQueries.createUserAccount.mockRejectedValue(new Error('Database query failed'));
		return request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(500);
	});
});
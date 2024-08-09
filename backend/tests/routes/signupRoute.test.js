const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/services/UserAccountServices');
const mockUserAccountServices = require('../../src/services/UserAccountServices');

describe('Test signup route', () => {
	it('with inexistant username should return code 400', async () => {
		const bodyReq = {
			username: null,
			password: 'password',
			fullname: 'fullname'
		};

		const response = await request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(400)

		expect(response.body.message).toEqual('Le champ username est requis');
	});

	it('with inexistant password should return code 400', async () => {
		const bodyReq = {
			username: 'userId',
			password: null,
			fullname: 'fullname'
		};

		const response = await request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(400)

		expect(response.body.message).toEqual('Le champ password est requis');
	});

	it('with inexistant fullname should return code 400', async () => {
		const bodyReq = {
			username: 'userId',
			password: 'password',
			fullname: null
		};
		const response = await request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(400)

		expect(response.body.message).toEqual('Le champ fullname est requis');
	});

	it('with successful signup should return user information in json with code 200', async () => {
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

		mockUserAccountServices.getUserByUserId.mockResolvedValue(undefined);
		mockUserAccountServices.createUserAccount.mockResolvedValue(mockUserDetails);

		const response = await request(app)
			.post('/signup')
			.send(bodyReq)
			.expect('Content-Type', /json/)
			.expect(200)

		expect(response.body).toEqual(expectUserDetails);
	});

	it('with unavailable username should return code 409', async () => {
		const bodyReq = {
			username: 'userId',
			password: 'password',
			fullname: 'fullname'
		};

		mockUserAccountServices.getUserByUserId.mockResolvedValue({});

		const response = await request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(409)

		expect(response.body.message).toEqual('Le username n\'est pas disponible');
	});

	it('should return code 500 if query fails', async () => {
		const bodyReq = {
			username: 'userId',
			password: 'password',
			fullname: 'fullname'
		};

		mockUserAccountServices.getUserByUserId.mockResolvedValue(undefined);
		mockUserAccountServices.createUserAccount.mockRejectedValue(new Error('Database query failed'));

		await request(app)
			.post('/signup')
			.send(bodyReq)
			.expect(500);
	});
});
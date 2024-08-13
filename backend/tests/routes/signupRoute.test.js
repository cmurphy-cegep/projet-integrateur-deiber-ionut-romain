const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/services/UserAccountServices');
const mockUserAccountServices = require('../../src/services/UserAccountServices');

describe('Test signup route', () => {
	let user;

	beforeEach(() => {
		user = {
			username: 'userId',
			password: 'password',
			fullname: 'fullname'
		};
	});

	it('with undefined username should return code 400', async () => {
		user.username = undefined;

		const response = await request(app)
			.post('/signup')
			.send(user)
			.expect(400)

		expect(response.body.message).toEqual(`L'identifiant est requis`);
	});

	it('with undefined password should return code 400', async () => {
		user.password = undefined;

		const response = await request(app)
			.post('/signup')
			.send(user)
			.expect(400)

		expect(response.body.message).toEqual('Le mot de passe est requis');
	});

	it('with undefined fullname should return code 400', async () => {
		user.fullname = undefined;

		const response = await request(app)
			.post('/signup')
			.send(user)
			.expect(400)

		expect(response.body.message).toEqual('Le nom complet est requis');
	});

	it('should throw an error with forbidden character in userId', async () => {
		user.username = 'username%';

		const expectedMessageError = `L'identifiant contient des caractères interdits`;

		const response = await request(app)
			.post('/signup')
			.send(user)
			.expect(400)

		expect(response.body.message).toEqual(expectedMessageError);
	});

	it('with successful signup should return user information in json with code 201', async () => {
		const mockUserDetails = {
			userId: 'userId',
			fullname: 'fullname',
			isAdmin: false
		};
		const expectUserDetails = mockUserDetails;

		mockUserAccountServices.getUserByUserId.mockResolvedValue(undefined);
		mockUserAccountServices.createUserAccount.mockResolvedValue(mockUserDetails);

		const response = await request(app)
			.post('/signup')
			.send(user)
			.expect('Content-Type', /json/)
			.expect(201)

		expect(response.body).toEqual(expectUserDetails);
	});

	it('with unavailable username should return code 409', async () => {
		mockUserAccountServices.getUserByUserId.mockResolvedValue({});

		const response = await request(app)
			.post('/signup')
			.send(user)
			.expect(409)

		expect(response.body.message).toEqual(`L'identifiant n'est pas disponible`);
	});

	it('should return code 500 if query fails', async () => {
		mockUserAccountServices.getUserByUserId.mockResolvedValue(undefined);
		mockUserAccountServices.createUserAccount.mockRejectedValue(new Error('Database query failed'));

		await request(app)
			.post('/signup')
			.send(user)
			.expect(500);
	});
});
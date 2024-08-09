const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/services/UserAccountServices');
const mockUserAccountServices = require('../../src/services/UserAccountServices');

describe('Test login route', () => {
	it('with correct credentials should return user information in json with code 200', async () => {
		const mockUserDetails = {
			userId: 'userId',
			passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
			passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
			fullname: 'fullname',
			isAdmin: false
		};
		const expectUserDetails = {
			userId: 'userId',
			fullname: 'fullname',
			isAdmin: false
		};

		mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);

		const response = await request(app)
			.get('/login')
			.auth('userId', 'topsecret')
			.expect('Content-Type', /json/)
			.expect(200);

		expect(response.body).toEqual(expectUserDetails);
	});

	it('with incorrect password should return code 401', async () => {
		const mockUserDetails = {
			userAccountId: 'userId',
			passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
			passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
			fullname: 'fullname',
			isAdmin: false
		};

		mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);

		await request(app)
			.get('/login')
			.auth('userId', 'wrongPassword')
			.expect(401);
	});

	it('with inexistant userID should return code 401', async () => {
		mockUserAccountServices.getUserByUserId.mockResolvedValue(undefined);
		await request(app)
			.get('/login')
			.auth('inexistantUserId', 'password')
			.expect(401)
	});

	it('should return code 500 if query fails', async () => {
		mockUserAccountServices.getUserByUserId.mockRejectedValue(new Error('Database query failed'));
		await request(app)
			.get('/login')
			.auth('inexistantUserId', 'password')
			.expect(500);
	});
});
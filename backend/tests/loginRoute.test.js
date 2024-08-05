const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/queries/userAccountQueries');
const userAccountQueries = require('../src/queries/userAccountQueries');

describe('Test login route', () => {
	describe('GET /login', () => {
		it('with correct credentials should return user information in json with code 200', () => {
			const mockUserDetails = {
				userAccountId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				userFullName: 'userFullname',
				isAdmin: false
			};
			const expectUserDetails = {
				userAccountId: 'userId',
				userFullName: 'userFullname',
				isAdmin: false
			};

			userAccountQueries.getLoginByUserAccountId.mockResolvedValue(mockUserDetails);

			return request(app)
				.get('/login')
				.auth('userId', 'topsecret')
				.expect('Content-Type', /json/)
				.expect(200)
				.then(response => {
					expect(response.body).toEqual(expectUserDetails);
				});
		});
		it('with incorrect password should return code 401', () => {
			const mockUserDetails = {
				userAccountId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				userFullName: 'userFullname',
				isAdmin: false
			};

			userAccountQueries.getLoginByUserAccountId.mockResolvedValue(mockUserDetails);
			return request(app)
				.get('/login')
				.auth('userId', 'wrongPassword')
				.expect(401)
		});
		it('with inexistant userID should return code 401', () => {
			userAccountQueries.getLoginByUserAccountId.mockResolvedValue(undefined);
			return request(app)
				.get('/login')
				.auth('inexistantUserId', 'password')
				.expect(401)
		});
		it('should return code 500 if query fails', () => {
			userAccountQueries.getLoginByUserAccountId.mockRejectedValue(new Error('Database query failed'));
			return request(app)
				.get('/login')
				.auth('inexistantUserId', 'password')
				.expect(500);
		});
	});
});
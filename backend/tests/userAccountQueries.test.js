const userAccountQueries = require('../src/queries/userAccountQueries');

jest.mock('../src/queries/dbPool');
const pool = require('../src/queries/dbPool');

describe('Test user account queries', () => {
	describe('getLoginByUserAccountId', () => {
		it('should return user details with valid user id', async () => {
			const userId = "validId";
			const mockUserDetails = {
				user_account_id: userId,
				password_hash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				password_salt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				full_name: 'userFullname',
				is_admin: false
			};
			const expectUserDetails = {
				userAccountId: userId,
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				userFullName: 'userFullname',
				isAdmin: false
			};

			pool.query.mockResolvedValueOnce({rows: [mockUserDetails]});

			const userDetails = await userAccountQueries.getLoginByUserAccountId(userId);
			expect(userDetails).toEqual(expectUserDetails);
		});
		it('should return "undefined" if user id not found ', async () => {
			pool.query.mockResolvedValueOnce({rows: []});
			const userDetails = await userAccountQueries.getLoginByUserAccountId("invalidId");
			expect(userDetails).toBeUndefined();
		});
	});
});
const UserAccountQueries = require("../../src/queries/UserAccountQueries");

jest.mock('../../src/queries/dbPool');
const mockPool = require('../../src/queries/dbPool');

describe('Test user account queries', () => {
	describe('getUserById', () => {
		it('should return user details with valid user id', async () => {
			const userId = 'userId';
			const mockResult = {
				rows: [{
					user_account_id: userId,
					password_hash: 'hashedPassword',
					password_salt: 'randomSalt',
					full_name: 'fullname',
					is_admin: false
				}]
			};

			const expectResult = {
				user_account_id: userId,
				password_hash: 'hashedPassword',
				password_salt: 'randomSalt',
				full_name: 'fullname',
				is_admin: false
			};

			mockPool.query.mockResolvedValue(mockResult);

			const result = await UserAccountQueries.getUserById(userId);

			expect(result).toEqual(expectResult);
		});

		it('should return "undefined" if user id not found ', async () => {
			mockPool.query.mockResolvedValue({rows: []});

			const result = await UserAccountQueries.getUserById("invalidId");

			expect(result).toBeUndefined();
		});
	});

	describe('insertUserAccount', () => {
		it('should sent hash and salt in query', async () => {
			await UserAccountQueries.insertUserAccount('userId', 'hashedPassword', 'randomSalt', 'fullname');

			const lastQueryCallArgs = mockPool.query.mock.calls.pop();

			expect(lastQueryCallArgs[0]).toMatch('NSERT INTO user_account');
			expect(lastQueryCallArgs[1]).toEqual(expect.arrayContaining(['hashedPassword', 'randomSalt']));
		});

		it('should create a non-admin account', async () => {
			await UserAccountQueries.insertUserAccount('userId', 'hashedPassword', 'randomSalt', 'fullname');

			const lastQueryCallArgs = mockPool.query.mock.calls.pop();

			expect(lastQueryCallArgs[0]).toContain('NSERT INTO user_account (user_account_id, password_hash, password_salt, full_name, is_admin)');
			expect(lastQueryCallArgs[0]).toContain('VALUES ($1, $2, $3, $4, false)');
		});
	});
});
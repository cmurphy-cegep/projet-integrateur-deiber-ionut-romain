const userAccountQueries = require('../src/queries/userAccountQueries');

jest.mock('../src/queries/dbPool');
const pool = require('../src/queries/dbPool');

describe('Test user account queries', () => {
	describe('getUserByUserId', () => {
		it('should return user details with valid user id', async () => {
			const userId = "validId";
			const mockUserDetails = {
				user_account_id: userId,
				password_hash: 'hashedPassword',
				password_salt: 'randomSalt',
				full_name: 'fullname',
				is_admin: false
			};
			const expectUserDetails = {
				userId: userId,
				passwordHash: 'hashedPassword',
				passwordSalt: 'randomSalt',
				fullName: 'fullname',
				isAdmin: false
			};

			pool.query.mockResolvedValueOnce({rows: [mockUserDetails]});

			const userDetails = await userAccountQueries.getUserByUserId(userId);
			expect(userDetails).toEqual(expectUserDetails);
		});
		it('should return "undefined" if user id not found ', async () => {
			pool.query.mockResolvedValueOnce({rows: []});
			const userDetails = await userAccountQueries.getUserByUserId("invalidId");
			expect(userDetails).toBeUndefined();
		});
	});

	describe('createUserAccount', () => {
		it('should return user details if user created', async () => {
			const userId = "userId";
			const mockUserDetails = {
				userAccountId: userId,
				password_hash: 'hashedPassword',
				password_salt: 'randomSalt',
				userFullName: 'fullname',
				isAdmin: false
			};
			const expectUserDetails = mockUserDetails;

			jest.spyOn(userAccountQueries, 'getUserByUserId').mockResolvedValue(mockUserDetails);

			const userDetails = await userAccountQueries.getUserByUserId(userId);
			expect(userDetails).toEqual(expectUserDetails);
		});
		it('should return undefined if user does not exist', async () => {
			jest.spyOn(userAccountQueries, '_userExistsById').mockResolvedValue(false);

			const user = await userAccountQueries.createUserAccount("userId", "password", "fullname");
			expect(user).toBeUndefined();
		});
	});
});
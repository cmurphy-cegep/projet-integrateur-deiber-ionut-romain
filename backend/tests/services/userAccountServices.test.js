const UserAccountServices = require('../../src/services/UserAccountServices');

jest.mock('../../src/queries/UserAccountQueries');
const mockUserAccountQueries = require('../../src/queries/UserAccountQueries');

describe('Test user account services', () => {
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
				fullname: 'fullname',
				isAdmin: false
			};

			mockUserAccountQueries.getUserById.mockResolvedValue(mockUserDetails);

			const userDetails = await UserAccountServices.getUserByUserId(userId);
			expect(userDetails).toEqual(expectUserDetails);
		});

		it('should return "undefined" if user id not found ', async () => {
			mockUserAccountQueries.getUserById.mockResolvedValue(undefined);
			const userDetails = await UserAccountServices.getUserByUserId("invalidId");
			expect(userDetails).toBeUndefined();
		});
	});

	it('createHashAndSalt should return hash from password and create salt', async () => {
		const password = 'motdepasse';
		const passwordHashAndSalt = await UserAccountServices._createHashAndSalt(password);

		expect(passwordHashAndSalt.passwordHash).toHaveLength(88); // 64 bytes in base64
		expect(passwordHashAndSalt.passwordSalt).toHaveLength(24); // 16 bytes in base64
	});

	describe('createUserAccount', () => {
		it('should return user details if user created', async () => {
			const userId = "userId";

			const mockPasswordHashAndSalt = {
				passwordHash: 'hashedPassword',
				passwordSalt: 'randomSalt'
			}

			const mockUserDetails = {
				userAccountId: userId,
				password_hash: 'hashedPassword',
				password_salt: 'randomSalt',
				userFullName: 'fullname',
				isAdmin: false
			};

			const expectUserDetails = mockUserDetails;

			mockUserAccountQueries.getUserById.mockResolvedValue(false);
			jest.spyOn(UserAccountServices, '_createHashAndSalt').mockResolvedValue(mockPasswordHashAndSalt);
			jest.spyOn(UserAccountServices, 'getUserByUserId').mockResolvedValue(mockUserDetails);

			const userDetails = await UserAccountServices.createUserAccount(userId, 'password', 'fullname');
			expect(userDetails).toEqual(expectUserDetails);
		});

		it('should return undefined if user already exists', async () => {
			mockUserAccountQueries.getUserById.mockResolvedValue(true);

			const user = await UserAccountServices.createUserAccount("userId", "password", "fullname");
			expect(user).toBeUndefined();
		});
	});
});
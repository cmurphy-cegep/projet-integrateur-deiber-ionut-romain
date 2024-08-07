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
				fullname: 'fullname',
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

	it('createHashAndSalt should return hash from password and create salt', async () => {
		const password = 'motdepasse';
		const passwordHashAndSalt = await userAccountQueries._createHashAndSalt(password);

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

			jest.spyOn(userAccountQueries, '_userExistsById').mockResolvedValue(false);
			jest.spyOn(userAccountQueries, '_createHashAndSalt').mockResolvedValue(mockPasswordHashAndSalt);
			jest.spyOn(userAccountQueries, 'getUserByUserId').mockResolvedValue(mockUserDetails);

			const userDetails = await userAccountQueries.createUserAccount(userId, 'password', 'fullname');
			expect(userDetails).toEqual(expectUserDetails);
		});
		it('should return undefined if user already exists', async () => {
			jest.spyOn(userAccountQueries, '_userExistsById').mockResolvedValue(true);

			const user = await userAccountQueries.createUserAccount("userId", "password", "fullname");
			expect(user).toBeUndefined();
		});
		it('should sent hash and salt in query', async () => {
			const mockPasswordHashAndSalt = {
				passwordHash: 'hashedPassword',
				passwordSalt: 'randomSalt'
			}

			jest.spyOn(userAccountQueries, '_userExistsById').mockResolvedValue(true);
			jest.spyOn(userAccountQueries, '_createHashAndSalt').mockResolvedValue(mockPasswordHashAndSalt);
			jest.spyOn(userAccountQueries, 'getUserByUserId').mockResolvedValue(null);

			await userAccountQueries.createUserAccount('userId', 'password', 'fullname');

			expect(pool.query).toHaveBeenCalledWith(
				expect.stringContaining('NSERT INTO user_account'),
				expect.arrayContaining(['userId', 'hashedPassword', 'randomSalt', 'fullname'])
			);
		});
		it('should create a non-admin account', async () => {
			const mockPasswordHashAndSalt = {
				passwordHash: 'hashedPassword',
				passwordSalt: 'randomSalt'
			}

			jest.spyOn(userAccountQueries, '_userExistsById').mockResolvedValue(false);
			jest.spyOn(userAccountQueries, '_createHashAndSalt').mockResolvedValue(mockPasswordHashAndSalt);
			jest.spyOn(userAccountQueries, 'getUserByUserId').mockResolvedValue(null);

			await userAccountQueries.createUserAccount('userId', 'password', 'fullname');

			expect(pool.query).toHaveBeenCalledWith(
				expect.stringContaining('NSERT INTO user_account (user_account_id, password_hash, password_salt, full_name, is_admin)'),
				[
					'userId',
					'hashedPassword',
					'randomSalt',
					'fullname',
					false
				]
			);
		});
	});
});
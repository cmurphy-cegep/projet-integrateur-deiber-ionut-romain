const crypto = require("crypto");
const {iterations, keylen, digest} = require('../config/cryptoConfig');
const UserAccountQueries = require("../queries/UserAccountQueries");

class UserAccountServices {
	static async _createHashAndSalt(password) {
		const saltBuf = crypto.randomBytes(16);
		const salt = saltBuf.toString("base64");
		const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);

		return {
			passwordHash: derivedKey.toString("base64"),
			passwordSalt: salt
		};
	}

	static async createUserAccount(userId, password, fullname) {
		const result = await UserAccountQueries.getUserById(userId);
		if (result) {
			return undefined;
		}

		const passwordHashAndSalt = await this._createHashAndSalt(password);

		await UserAccountQueries.insertUserAccount(
			userId,
			passwordHashAndSalt.passwordHash,
			passwordHashAndSalt.passwordSalt,
			fullname
		);

		return this.getUserByUserId(userId);
	}

	static async getUserByUserId(userId) {
		const result = await UserAccountQueries.getUserById(userId);

		if (result) {
			return {
				userId: result.user_account_id,
				passwordHash: result.password_hash,
				passwordSalt: result.password_salt,
				fullname: result.full_name,
				isAdmin: result.is_admin
			};
		}
		return undefined;
	}
}

module.exports = UserAccountServices;
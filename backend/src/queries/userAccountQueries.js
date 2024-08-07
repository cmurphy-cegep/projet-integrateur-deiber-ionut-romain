const pool = require('./dbPool');

class UserAccountQueries {
	static async getUserByUserId(userId) {
		const result = await pool.query(
			`SELECT user_account_id, password_hash, password_salt, full_name, is_admin
             FROM user_account
             WHERE user_account_id = $1`,
			[userId]
		);

		const row = result.rows[0];
		if (row) {
			return {
				userId: row.user_account_id,
				passwordHash: row.password_hash,
				passwordSalt: row.password_salt,
				fullName: row.full_name,
				isAdmin: row.is_admin
			};
		}
		return undefined;
	}

	static async _userExistsById(userId) {
		const result = await pool.query(
			`SELECT *
             FROM user_account
             WHERE user_account_id = $1`,
			[userId]
		);

		const row = result.rows[0];
		if (row)
			return true;
		return false;
	}

	static async createUserAccount(userId, password, fullname) {
		const userExists = await this._userExistsById(userId);
		if (!userExists) {
			return undefined;
		}

		await pool.query(
			`INSERT INTO user_account (user_account_id, password_hash, password_salt, full_name, is_admin)
             VALUES ($1, $2, $3, $4)`,
			[userId, 'passwordHash', 'passwordSalt', fullname, false]
		);

		return this.getUserByUserId(userId);
	}
}

module.exports = UserAccountQueries;
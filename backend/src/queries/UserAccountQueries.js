const pool = require('../queries/dbPool');

class UserAccountQueries {
	static async getUserById(userId) {
		const result = await pool.query(
			`SELECT user_account_id, password_hash, password_salt, full_name, is_admin
             FROM user_account
             WHERE user_account_id = $1`,
			[userId]
		);
		return result.rows[0];
	}

	static async insertUserAccount(userId, passwordHash, passwordSalt, fullname) {
		await pool.query(
			`INSERT INTO user_account (user_account_id, password_hash, password_salt, full_name, is_admin)
             VALUES ($1, $2, $3, $4, false)`,
			[userId, passwordHash, passwordSalt, fullname]
		);
	}
}

module.exports = UserAccountQueries;
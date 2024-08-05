const pool = require('./dbPool');

const getLoginByUserAccountId = async (userAccountId) => {
	const result = await pool.query(
		`SELECT user_account_id, password_hash, password_salt, full_name, is_admin
         FROM user_account
         WHERE user_account_id = $1`,
		[userAccountId]
	);

	const row = result.rows[0];
	if (row) {
		return {
			userAccountId: row.user_account_id,
			passwordHash: row.password_hash,
			passwordSalt: row.password_salt,
			userFullName: row.full_name,
			isAdmin: row.is_admin
		};
	}
	return undefined;
};
exports.getLoginByUserAccountId = getLoginByUserAccountId;

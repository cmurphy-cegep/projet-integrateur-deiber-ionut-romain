const pool = require("../../src/queries/dbPool");

describe('Postgres DB Connection', () => {
	it('should establish a successful pg db connection', async () => {
		const client = await pool.connect();

		expect(client).toBeTruthy();

		client.release();
	});
});
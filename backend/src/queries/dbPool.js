require('dotenv').config();
const {Pool} = require('pg');

const dbConfig = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
};

module.exports = new Pool(dbConfig);

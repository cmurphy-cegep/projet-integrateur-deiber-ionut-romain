const Pool = require('pg').Pool;

const dbConfig = require('../../config/db_config');

module.exports = new Pool(dbConfig);

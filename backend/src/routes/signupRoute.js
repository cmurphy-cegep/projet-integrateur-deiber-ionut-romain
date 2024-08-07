const express = require('express');
const router = express.Router();
const userAccountQueries = require('../queries/userAccountQueries');
const HttpError = require("../error/HttpError");

router.post('/', (req, res, next) => {
		const userId = req.body.username;
		const password = req.body.password;
		const fullname = req.body.fullname;

		userAccountQueries.createUserAccount(userId, password, fullname)
			.then(response => {
				if (response) {
					const userDetails = {
						userId: response.userId,
						fullName: response.fullName,
						isAdmin: response.isAdmin
					};

					res.json(userDetails);
				}
			});
	}
);

module.exports = router;
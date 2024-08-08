const express = require('express');
const router = express.Router();
const userAccountQueries = require('../queries/userAccountQueries');
const HttpError = require("../error/HttpError");

router.post('/', (req, res, next) => {
		const userId = req.body.username;
		const password = req.body.password;
		const fullname = req.body.fullname;

		if (!userId || userId === '') {
			return next(new HttpError(400, 'Le champ username est requis'));
		}

		if (!password || password === '') {
			return next(new HttpError(400, 'Le champ password est requis'));
		}

		if (!fullname || fullname === '') {
			return next(new HttpError(400, 'Le champ fullname est requis'));
		}

		userAccountQueries.createUserAccount(userId, password, fullname)
			.then(response => {
				if (response) {
					const userDetails = {
						userId: response.userId,
						fullname: response.fullname,
						isAdmin: response.isAdmin
					};

					res.json(userDetails);
				} else {
					return next(new HttpError(409, 'Le username n\'est pas disponible'));
				}
			}).catch(err => {
			return next(err);
		});
	}
);

module.exports = router;
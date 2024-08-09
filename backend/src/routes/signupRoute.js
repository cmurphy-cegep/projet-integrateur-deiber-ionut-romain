const express = require('express');
const router = express.Router();
const UserAccountServices = require('../services/UserAccountServices');
const HttpError = require("../error/HttpError");

router.post('/', async (req, res, next) => {
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

		try {
			const user = await UserAccountServices.getUserByUserId(userId);
			if (user) {
				return next(new HttpError(409, 'Le username n\'est pas disponible'));
			}

			const response = await UserAccountServices.createUserAccount(userId, password, fullname);
			if (response) {
				const userDetails = {
					userId: response.userId,
					fullname: response.fullname,
					isAdmin: response.isAdmin
				};
				res.status(201).json(userDetails);
			}
		} catch (err) {
			return next(err);
		}
	}
);

module.exports = router;
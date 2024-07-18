const express = require('express');
const router = express.Router();
const passport = require('../auth/authStrategy');

router.get('/',
	passport.authenticate('basic', {session: false}),
	(req, res, next) => {
		if (req.user) {
			const userDetails = {
				userAccountId: req.user.userAccountId,
				userFullName: req.user.userFullName,
				isAdmin: req.user.isAdmin,
				isActive: req.user.isActive
			};

			res.json(userDetails);
		} else {
			return next({status: 500, message: "Propriété user absente"});
		}
	}
);

module.exports = router;
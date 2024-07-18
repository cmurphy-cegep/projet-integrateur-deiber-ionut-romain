const passport = require('passport');
const BasicStrategyModified = require('./BasicStrategyModified');
const crypto = require('crypto');
const userAccountQueries = require("../queries/userAccountQueries");

passport.use(new BasicStrategyModified((username, password, done) => {
	userAccountQueries.getLoginByUserAccountId(username).then(user => {
		if (!user) {
			return done(null, false);
		}

		const iterations = 100000;
		const keylen = 64;
		const digest = "sha512";

		crypto.pbkdf2(password, user.passwordSalt, iterations, keylen, digest, (err, hashedPassword) => {
			if (err) {
				return done(err);
			}

			const userPasswordHashBuffer = Buffer.from(user.passwordHash, "base64");
			if (!crypto.timingSafeEqual(userPasswordHashBuffer, hashedPassword)) {
				return done(null, false);
			}

			return done(null, user);
		});

	}).catch(err => {
		return done(err);
	});
}));

module.exports = passport;
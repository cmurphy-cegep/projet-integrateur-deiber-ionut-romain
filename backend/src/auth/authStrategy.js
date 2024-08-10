const passport = require('passport');
const BasicStrategyModified = require('./BasicStrategyModified');
const crypto = require('crypto')
const {iterations, keylen, digest} = require('./cryptoConfig');
const UserAccountServices = require("../services/UserAccountServices");

passport.use(new BasicStrategyModified((username, password, done) => {
	UserAccountServices.getUserByUserId(username).then(user => {
		if (!user) {
			return done(null, false);
		}

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
const express = require('express');
const path = require('path');
const logger = require('morgan');
const HttpError = require('./HttpError');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const crypto = require('crypto');

const userAccountQueries = require("./queries/UserAccountQueries");

const recipeRouter = require('./routes/recipeRouter');

const app = express();

app.use(logger('dev'));
app.use(express.json());

// Pour servir les images et autres contenus statiques :
app.use(express.static(path.join(__dirname, 'public')));

app.use('/recipes', recipeRouter);

// *** GESTION DES CONNEXIONS ***

// Classe qui surcharge la méthode _challenge() de BasicStrategy
// afin de modifier l'en-tête Www-Authenticate retourné lorsque l'authentification
// basic échoue. Si l'en-tête comporte la chaîne "Basic realm="..."", le comportement
// des navigateurs est de présenter un dialogue demandant de s'authentifier. On veut
// éviter cela, donc on ajoute un "x" au début.
class BasicStrategyModified extends BasicStrategy {
	constructor(options, verify) {
		return super(options, verify);
	}

	_challenge() {
		return 'xBasic realm="' + this._realm + '"';
	}
}

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

app.get('/login',
	passport.authenticate('basic', {session: false}),
	(req, res, next) => {
		if (req.user) {
			// On crée un nouvel objet pour la réponse en JSON, afin de ne pas
			// retourner le hash et salt du mot de passe :
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

// *** GESTION DES ERREURS ***

// Gestionnaire d'erreur, sera invoqué si on appelle next(...) en passant
// un objet d'erreur.
app.use((err, req, res, next) => {
	console.log("error handler: ", err);
	if (res.headersSent) {
		return next(err);
	}
	res.status(err.status || 500)
	if (err instanceof HttpError) {
		res.json(err.getJsonMessage());
	} else {
		res.json(err);
	}
});

module.exports = app;
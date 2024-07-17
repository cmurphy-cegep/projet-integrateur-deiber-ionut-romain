const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const HttpError = require('./HttpError');

// const passport = require('passport');
// const BasicStrategy = require('passport-http').BasicStrategy;
// const crypto = require('crypto');

// const userAccountQueries = require("./queries/UserAccountQueries");

// const productRouter = require('./routes/productRouter');
// const cartRouter = require('./routes/cartRouter');
// const orderRouter = require('./routes/orderRouter');

const app = express();

//app.use(logger('dev'));
app.use(express.json());
//app.use(cookieParser());

// Pour servir les images et autres contenus statiques :
app.use(express.static(path.join(__dirname, 'public')));

// Classe qui surcharge la méthode _challenge() de BasicStrategy
// afin de modifier l'en-tête Www-Authenticate retourné lorsque l'authentification
// basic échoue. Si l'en-tête comporte la chaîne "Basic realm="..."", le comportement
// des navigateurs est de présenter un dialogue demandant de s'authentifier. On veut
// éviter cela, donc on ajoute un "x" au début.
// class BasicStrategyModified extends BasicStrategy {
// 	constructor(options, verify) {
// 		return super(options, verify);
// 	}
//
// 	_challenge() {
// 		return 'xBasic realm="' + this._realm + '"';
// 	}
// }

// passport.use(new BasicStrategyModified((username, password, cb) => {
// 	userAccountQueries.getLoginByUserAccountId(username).then(user => {
// 		if (!user) {
// 			return cb(null, false);
// 		}
//
// 		if (!user.isActive) {
// 			return cb(null, false);
// 		}
//
// 		const iterations = 100000;
// 		const keylen = 64;
// 		const digest = "sha512";
//
// 		crypto.pbkdf2(password, user.passwordSalt, iterations, keylen, digest, (err, hashedPassword) => {
// 			if (err) {
// 				return cb(err);
// 			}
//
// 			const userPasswordHashBuffer = Buffer.from(user.passwordHash, "base64");
// 			if (!crypto.timingSafeEqual(userPasswordHashBuffer, hashedPassword)) {
// 				return cb(null, false);
// 			}
//
// 			return cb(null, user);
// 		});
//
// 	}).catch(err => {
// 		return cb(err);
// 	});
// }));

// app.use('/products', productRouter);
// app.use('/cart', cartRouter);
// app.use('/orders', orderRouter);

// app.get('/login',
// 	passport.authenticate('basic', { session: false }),
// 	(req, res, next) => {
// 		if (req.user) {
// 			// On crée un nouvel objet pour la réponse en JSON, afin de ne pas
// 			// retourner le hash et salt du mot de passe:
// 			const userDetails = {
// 				userAccountId: req.user.userAccountId,
// 				userFullName: req.user.userFullName,
// 				isAdmin: req.user.isAdmin,
// 				isActive: req.user.isActive
// 			};
//
// 			res.json(userDetails);
// 		} else {
// 			return next({ status: 500, message: "Propriété user absente" });
// 		}
// 	}
// );

// *** GESTION DES ERREURS ***

// Gestionnaire d'erreur, sera invoqué si on appelle next(...) en passant
// un objet d'erreur.
// app.use((err, req, res, next) => {
// 	console.log("error handler: ", err);
// 	if (res.headersSent) {
// 		return next(err);
// 	}
// 	res.status(err.status || 500)
// 	if (err instanceof HttpError) {
// 		res.json(err.getJsonMessage());
// 	} else {
// 		res.json(err);
// 	}
// });

module.exports = app;
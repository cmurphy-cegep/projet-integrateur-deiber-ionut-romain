const express = require('express');
const path = require('path');
const logger = require('morgan');
const HttpError = require('./HttpError');

const recipeRouter = require('./routes/recipeRouter');

const app = express();

app.use(logger('dev'));
app.use(express.json());

// Pour servir les images et autres contenus statiques :
app.use(express.static(path.join(__dirname, 'public')));

app.use('/recipes', recipeRouter);

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
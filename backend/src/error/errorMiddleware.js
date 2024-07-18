const HttpError = require('./HttpError');

// Gestionnaire d'erreur, sera invoqué si on appelle next(...) en passant un objet d'erreur.
const errorMiddleware = (err, req, res, next) => {
	console.log("error handler: ", err);
	if (res.headersSent) {
		return next(err);
	}
	res.status(err.status || 500);
	if (err instanceof HttpError) {
		res.json(err.getJsonMessage());
	} else {
		res.json(err);
	}
};

module.exports = errorMiddleware;
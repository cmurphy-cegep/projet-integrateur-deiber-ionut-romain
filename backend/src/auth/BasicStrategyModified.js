const BasicStrategy = require('passport-http').BasicStrategy;

// Classe qui surcharge la méthode _challenge() de BasicStrategy
// afin de modifier l'en-tête Www-Authenticate retourné lorsque l'authentification
// basic échoue. Si l'en-tête comporte la chaîne "Basic realm="..."", le comportement
// des navigateurs est de présenter un dialogue demandant de s'authentifier. On veut
// éviter cela, donc on ajoute un "x" au début.
class BasicStrategyModified extends BasicStrategy {
	constructor(options, verify) {
		super(options, verify);
	}

	_challenge() {
		return 'xBasic realm="' + this._realm + '"';
	}
}

module.exports = BasicStrategyModified;
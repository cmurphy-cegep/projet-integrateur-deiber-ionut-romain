function isValidIdSyntax(id) {
	const regex = /^[a-zA-Z0-9_]+$/;
	return regex.test(id);
}

module.exports = {isValidIdSyntax};
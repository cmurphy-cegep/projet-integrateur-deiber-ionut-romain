const express = require('express');
const router = express.Router();
const passport = require('passport');
const HttpError = require("../error/HttpError");
const recipeQueries = require("../queries/recipeQueries");
const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");

router.get('/', (req, res, next) => {
	recipeQueries.getAllRecipes().then(recipes => {
		res.json(recipes);
	}).catch(err => {
		return next(err);
	});
});

router.get('/:id', (req, res, next) => {
	const id = req.params.id;
	recipeQueries.getDetailedRecipeById(id).then(recipe => {
		if (recipe) {
			res.json(recipe);
		} else {
			return next(new HttpError(404, `Recette ${id} introuvable`));
		}
	}).catch(err => {
		return next(err);
	});
});

router.get('/:id/image', (req, res, next) => {
	const id = req.params.id;
	recipeQueries.getRecipeImageContent(id).then(imageInfo => {
		if (imageInfo && imageInfo.imageContent) {
			if (imageInfo.imageContentType) {
				res.header('Content-Type', imageInfo.imageContentType);
			}
			res.send(imageInfo.imageContent);
		} else {
			// Si le produit n'a pas d'image, on va retourner une image transparente de 1 pixel
			// afin d'éviter d'avoir une image brisée dans le front-end
			res.header('Content-Type', 'image/png');
			res.send(onePixelTransparentPngImage);
		}
	}).catch(err => {
		return next(err);
	});
});

router.post('/',
	passport.authenticate('basic', {session: false}),
	(req, res, next) => {
		if (!req.user.isAdmin) {
			return next(new HttpError(403, 'Vous n\'avez pas les permissions'));
		}

		const id = req.body.id;
		if (!id || id === '') {
			return next(new HttpError(400, 'Le champ id est requis'));
		}

		recipeQueries.getRecipeById(id).then(recipe => {
			if (recipe) {
				throw new HttpError(400, `Une recette avec l'id ${id} existe déjà`);
			}

			return recipeQueries.createRecipe(req.body);
		}).then(result => {
			res.json(result);
		}).catch(err => {
			next(err);
		});
	});

module.exports = router;
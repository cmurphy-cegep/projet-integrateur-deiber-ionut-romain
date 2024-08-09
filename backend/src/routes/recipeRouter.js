const express = require('express');
const router = express.Router();
const passport = require('passport');
const HttpError = require("../error/HttpError");
const RecipeServices = require("../services/RecipeServices");
const {isValidIdSyntax} = require("../utils/utils");

router.get('/', async (req, res, next) => {
	try {
		const recipes = await RecipeServices.getAllRecipes();
		res.json(recipes);
	} catch (err) {
		return next(err);
	}
});

router.get('/:id', async (req, res, next) => {
	const id = req.params.id;

	try {
		const recipe = await RecipeServices.getDetailedRecipeById(id);
		if (recipe) {
			res.json(recipe);
		} else {
			return next(new HttpError(404, `Recette ${id} introuvable`));
		}
	} catch (err) {
		return next(err);
	}
});

router.get('/:id/image', async (req, res, next) => {
	const id = req.params.id;

	try {
		const imageInfo = await RecipeServices.getRecipeImageContent(id);
		if (imageInfo && imageInfo.imageContent) {
			if (imageInfo.imageContentType) {
				res.header('Content-Type', imageInfo.imageContentType);
			}
			res.send(imageInfo.imageContent);
		} else {
			// Si le produit n'a pas d'image, on va retourner une image transparente de 1 pixel
			// afin d'éviter d'avoir une image brisée dans le front-end
			const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");

			res.header('Content-Type', 'image/png');
			res.send(onePixelTransparentPngImage);
		}
	} catch (err) {
		return next(err);
	}
});

router.post('/',
	passport.authenticate('basic', {session: false}),
	async (req, res, next) => {
		if (!req.user.isAdmin) {
			return next(new HttpError(403, 'Vous n\'avez pas les permissions'));
		}

		const id = req.body.id;
		if (!id || id === '') {
			return next(new HttpError(400, 'L\'identifiant est requis'));
		}

		if (!isValidIdSyntax(id)) {
			return next(new HttpError(400, 'L\'identifiant contient des caractères interdits'));
		}

		try {
			const recipe = await RecipeServices.getRecipeById(id);
			if (recipe) {
				return next(new HttpError(400, `Une recette avec l'id ${id} existe déjà`));
			}

			const result = await RecipeServices.createRecipe(req.body);

			res.status(201).json(result);
		} catch (err) {
			next(err);
		}
	});

router.put('/:id',
	passport.authenticate('basic', {session: false}),
	async (req, res, next) => {
		if (!req.user.isAdmin) {
			return next(new HttpError(403, 'Vous n\'avez pas les permissions'));
		}

		const id = req.body.id;
		if (!id || id === '') {
			return next(new HttpError(400, 'L\'identifiant est requis'));
		}

		if (id !== req.body.id) {
			return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que la recette fournie a l'id ${req.body.id}`));
		}

		try {
			const recipe = await RecipeServices.getRecipeById(id);
			if (!recipe) {
				return next(new HttpError(400, `L'id ${id} ne correspond à aucune recette existante`));
			}

			const result = await RecipeServices.updateRecipe(req.body);

			res.json(result);
		} catch (err) {
			next(err);
		}
	}
);

module.exports = router;
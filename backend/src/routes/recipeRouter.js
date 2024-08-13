const express = require('express');
const router = express.Router();
const passport = require('passport');
const HttpError = require("../error/HttpError");
const {isValidIdSyntax} = require("../utils/utils");

// Le module multer sert à gérer les téléversements (upload) de fichiers
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const RecipeServices = require("../services/RecipeServices");

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
			return next(new HttpError(403, `Vous n'avez pas les permissions`));
		}

		const id = req.body.id;
		if (!id || id === '') {
			return next(new HttpError(400, `L'identifiant est requis`));
		}

		if (!isValidIdSyntax(id)) {
			return next(new HttpError(400, `L'identifiant contient des caractères interdits`));
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
			return next(new HttpError(403, `Vous n'avez pas les permissions`));
		}

		const id = req.params.id;
		if (id !== req.body.id) {
			return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que la recette fournie a l'id ${req.body.id}`));
		}

		try {
			const recipe = await RecipeServices.getRecipeById(id);
			if (!recipe) {
				return next(new HttpError(404, `L'id ${id} ne correspond à aucune recette existante`));
			}

			const result = await RecipeServices.updateRecipe(req.body);

			res.json(result);
		} catch (err) {
			next(err);
		}
	});

router.delete('/:id',
	passport.authenticate('basic', {session: false}),
	async (req, res, next) => {
		if (!req.user.isAdmin) {
			return next(new HttpError(403, `Vous n'avez pas les permissions`));
		}

		const id = req.params.id;

		try {
			const recipe = await RecipeServices.getRecipeById(id);
			if (!recipe) {
				return next(new HttpError(404, `L'id ${id} ne correspond à aucune recette existante`));
			}

			await RecipeServices.deleteRecipe(id);

			res.json({});
		} catch (err) {
			next(err);
		}
	});

router.post('/:id/image',
	passport.authenticate('basic', {session: false}),
	// Fonction middleware de multer pour gérer l'upload d'un fichier dans ce endpoint.
	// Cet appel de middleware doit venir après celui de l'authentification.
	upload.single('recipe-image'), // Doit correspondre à l'id du champ dans le formulaire html
	async (req, res, next) => {
		if (!req.user.isAdmin) {
			return next(new HttpError(403, `Vous n'avez pas les permissions`));
		}

		const id = req.params.id;

		try {
			const recipe = await RecipeServices.getRecipeById(id);
			if (!recipe) {
				return next(new HttpError(404, `L'id ${id} ne correspond à aucune recette existante`));
			}

			// Le middleware upload.single(...) rendra accessible le contenu binaire du fichier
			// téléversé dans req.file.buffer et le type de fichier (p.ex. "image/jpeg")
			// dans req.file.mimetype:
			await RecipeServices.updateRecipeImage(id, req.file.buffer, req.file.mimetype);

			res.json("");
		} catch (err) {
			next(err);
		}
	});

router.post('/:id/comments',
	passport.authenticate('basic', {session: false}),
	async (req, res, next) => {

		const recipeId = req.params.id;
		const userId = req.user.userId;

		try {
			const recipe = await RecipeServices.getRecipeById(recipeId);
			if (!recipe) {
				return next(new HttpError(404, `L'id ${recipeId} ne correspond à aucune recette existante`));
			}

			const result = await RecipeServices.createRecipeComment(recipeId, userId, req.body);

			res.status(201).json(result);
		} catch (err) {
			next(err);
		}
	});

router.post('/:id/ratings',
	passport.authenticate('basic', {session: false}),
	async (req, res, next) => {

		const recipeId = req.params.id;
		const userId = req.user.userId;

		try {
			const recipe = await RecipeServices.getRecipeById(recipeId);
			if (!recipe) {
				return next(new HttpError(404, `L'id ${recipeId} ne correspond à aucune recette existante`));
			}

			const result = await RecipeServices.addOrUpdateRecipeRating(recipeId, userId, req.body.rating);

			res.json(result);
		} catch (err) {
			next(err);
		}
	});

router.get('/:id/ratings/user-rating',
	passport.authenticate('basic', {session: false}),
	async (req, res, next) => {

		const recipeId = req.params.id;
		const userId = req.user.userId;

		try {
			const recipe = await RecipeServices.getRecipeById(recipeId);
			if (!recipe) {
				return next(new HttpError(404, `L'id ${recipeId} ne correspond à aucune recette existante`));
			}

			const result = await RecipeServices.getUserRatingForRecipe(recipeId, userId);
			if (result) {
				res.json(result);
			} else {
				return next(new HttpError(404, `Aucune note correspondante pour l'utilisateur ${userId} et la recette ${recipeId}`));
			}
		} catch (err) {
			next(err);
		}
	});

module.exports = router;
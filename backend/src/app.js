const express = require('express');
const errorMiddleware = require('./error/errorMiddleware');

const recipeRouter = require('./routes/recipeRouter');
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');

const app = express();

app.use(express.json());

app.use('/recipes', recipeRouter);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);

app.get('/health', (req, res) => {
	res.status(200).send('OK');
});

app.use(errorMiddleware);

module.exports = app;
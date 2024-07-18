const express = require('express');
const logger = require('morgan');
const errorMiddleware = require('./error/errorMiddleware');

const recipeRouter = require('./routes/recipeRouter');
const loginRoute = require('./routes/loginRoute');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/recipes', recipeRouter);
app.use('/login', loginRoute);

app.use(errorMiddleware);

module.exports = app;
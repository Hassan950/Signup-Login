const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const httpStatus = require('http-status');
const AppError = require('./utils/AppError');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { authLimiter } = require('./middlewares/rateLimiter');
const config = require('config');
const routes = require('./routes/v1');

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(
  express.urlencoded({
    extended: true
  })
);


// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// limit repeated failed requests to auth endpoints
if (config.get('NODE_ENV') === 'production') {
  app.use('/api/v1/auth', authLimiter);
  app.use('/api/v1/users/login', authLimiter);
}

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new AppError('Not found', httpStatus.NOT_FOUND));
});

// convert error to AppError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;

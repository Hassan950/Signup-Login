const config = require('config');
const AppError = require('../utils/AppError');
const httpStatus = require('http-status');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  // getting token and check if it is there
  let token;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(new AppError('Please log in.', httpStatus.UNAUTHORIZED));

  // verification token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.get('JWT_KEY'));
  } catch (er) {
    return next(new AppError('Invalid Token', httpStatus.BAD_REQUEST));
  }

  // retrieving the user from the database
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exists. Please Sign up.',
        httpStatus.UNAUTHORIZED
      )
    );
  }
  req.user = user;
  next();
};

const { User } = require('../models/');
const AppError = require('../utils/AppError');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const createToken = user => {
  user.password = undefined;
  return (token = jwt.sign(
    {
      id: user._id
    },
    config.get('JWT_KEY'),
    {
      expiresIn: config.get('JWT_EXPIRES_IN')
    }
  ));
};

exports.signup = async (req, res, next) => {
  const user = await User.create(req.body);
  const token = createToken(user);
  res.setHeader('x-auth-token', token);
  res.status(httpStatus.OK).json({
    token: token,
    user: user
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(
      new AppError('Incorrect email or password!', httpStatus.UNAUTHORIZED)
    );
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(
      new AppError('Incorrect email or password!', httpStatus.UNAUTHORIZED)
    );
  }

  const token = createToken(user);
  res.setHeader('x-auth-token', token);
  res.status(httpStatus.OK).json({
    token: token,
    user: user
  });
};

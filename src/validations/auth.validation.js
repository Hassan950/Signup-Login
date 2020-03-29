const Joi = require('@hapi/joi');

exports.signup = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8),
    passwordConfirm: Joi.string().required(),
    username: Joi.string()
      .required()
      .min(5)
      .max(30),
    displayName: Joi.string()
      .required()
  })
};

exports.login = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8)
  })
};
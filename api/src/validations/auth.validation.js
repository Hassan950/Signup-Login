const Joi = require('@hapi/joi');

exports.signup = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .message('Password should at least have one letter and one number'),
    passwordConfirm: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Password confirmation must match password'
      }),
    username: Joi.string()
      .required()
      .min(5)
      .max(30),
    displayName: Joi.string().required()
  })
};

exports.login = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
  })
};

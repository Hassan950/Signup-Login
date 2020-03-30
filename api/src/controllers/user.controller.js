const httpStatus = require('http-status');


exports.getProfile = async (req, res, next) => {
  res.status(httpStatus.OK).send(req.user);
};

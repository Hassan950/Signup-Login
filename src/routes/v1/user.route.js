const express = require('express');
const { userController } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

router
  .route('/')
  .get(
    catchAsync(authMiddleware.authenticate),
    catchAsync(userController.getProfile)
  );

module.exports = router;

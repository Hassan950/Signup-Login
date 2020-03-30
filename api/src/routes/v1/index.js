const express = require('express');
const homeRoute = require('./home.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');

const router = express.Router();

router.use('/', homeRoute);
router.use('/auth', authRoute);
router.use('/me', userRoute);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/password-reset', authController.getPassReset);

router.post('/password-reset', authController.postPassReset);

router.get('/new-password/:token', authController.getNewPassword);

router.get('/new-password/', authController.postNewPassword);

module.exports = router;
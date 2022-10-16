const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/password-reset', authController.getPassReset);

router.post('/password-reset', authController.postPassReset);

router.get('/password-reset/:token', authController.getNewPassword);

router.post('/new-password/', authController.postNewPassword);

module.exports = router;
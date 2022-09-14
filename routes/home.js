const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home')

router.get('/', homeController.getHome);

router.get('/login', homeController.getLogin);

router.get('/register', homeController.getRegister);

router.post('/register-user', homeController.registerPost);

module.exports = router;
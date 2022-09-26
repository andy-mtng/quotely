const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const isLoggedIn = require('../utils/isLoggedIn');

router.get('/', homeController.getHome);

router.get('/login', homeController.getLogin);

router.post('/login', homeController.postLogin);

router.get("/log-out", isLoggedIn, homeController.getLogout);

router.get('/register', homeController.getRegister);

router.post('/register', homeController.registerPost);

router.get('/profile', homeController.getProfile);

module.exports = router;
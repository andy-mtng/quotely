const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const isLoggedIn = require('../utils/isLoggedIn');
const upload = require('../utils/upload');

router.get('/', homeController.getHome);

router.get('/login', homeController.getLogin);

router.post('/login', homeController.postLogin);

router.get("/log-out", isLoggedIn, homeController.getLogout);

router.get('/register', homeController.getRegister);

router.post('/register', homeController.registerPost);

router.get('/profile', isLoggedIn, homeController.getProfile);

router.post('/profile-picture', isLoggedIn, upload.single('image'), homeController.getProfile);


module.exports = router;
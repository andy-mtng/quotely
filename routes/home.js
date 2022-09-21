const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.get('/', homeController.getHome);

router.get('/login', homeController.getLogin);

router.post('/login', homeController.postLogin);

router.get("/log-out", homeController.getLogout);

router.get('/register', homeController.getRegister);

router.post('/register', homeController.registerPost);

module.exports = router;
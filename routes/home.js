const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const passport = require('passport');
const { body, validationResult } = require("express-validator");


router.get('/', homeController.getHome);

router.get('/login', homeController.getLogin);

router.post('/login', 
body('email')
    .trim()
    .isEmail()
    .withMessage('You must use a valid email.')
    .escape(),
passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

router.get("/log-out", homeController.getLogout);

router.get('/register', homeController.getRegister);

router.post('/register', homeController.registerPost);

module.exports = router;
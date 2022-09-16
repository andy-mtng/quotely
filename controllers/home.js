const User = require('../models/user');
const passport = require("passport");


exports.getHome = (req, res) => {
    res.render('home');
};

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.registerPost = (req, res) => {
    const userInfo = req.body;
    
    const newUser = new User({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        password: userInfo.password,
        isMember: false,
        isAdmin: (userInfo.isAdmin === "true")
    });

    newUser.save((err) => {
        if (err) {console.log(err)}
        console.log('User saved to database.');
    });

    res.redirect('/');
};
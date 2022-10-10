const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const passport = require('passport');

exports.getHome = (req, res, next) => {
    // If a user is logged in, redirect to posts instead of the home page
    if (req.user) {
        res.redirect('/posts');
    } else {
        res.render('home');
    }
};

exports.getLogin = (req, res, next) => {
    res.render('login', {message: req.flash('error')});
};

exports.getLogout = (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
}

exports.postLogin = [
body('email')
    .trim()
    .isLength({min: 1})
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .escape(),
body('password')
    .trim()
    .isLength({min: 1})
    .withMessage('Password is required.')
    .escape(),
(req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // console.log(errors);
        return res.render('login', {message: null, validationErrors: errors.array()});
    } else {
        passport.authenticate("local", {
            failureFlash: true,
            successRedirect: "/",
            failureRedirect: "/login"
        })(req,res);
    }
}];

exports.getRegister = (req, res, next) => {
    res.render('register');
};

exports.registerPost = [
body('firstName', 'First name cannot be empty.')
    .trim()
    .isLength({min: 1})
    .escape(),
body('lastName', 'Last name cannot be empty.')
    .trim()
    .isLength({min: 1})
    .escape(),
body('email')
    .trim()
    .normalizeEmail()  // Lowercase the domain part of the email
    .isLength({min: 1})
    .withMessage('Email cannot be empty.')
    .isEmail()
    .withMessage('You must enter a valid email.')
    .escape()
    .custom(value => {  // Custom validator to make sure email is not already in use
        return User.findOne({email: value}).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        })
    }),
body('password')
    .trim()
    .isLength({min: 3})
    .withMessage('Password must be at least 3 characters.')
    .escape(),
body('confirmPassword')
    .trim()
    .escape()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password.');
        }
        // Indicates the success of this synchronous custom validator
        return true;
        }),
(req, res) => {
    const userInfo = req.body;

    // Use bcrypt to convert the plaintext password into a secure one
    bcrypt.hash(userInfo.password, 10, (err, hashedPassword) => {
        if (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        } else {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render('register', {validationErrors: errors.array()});
            }

            const newUser = new User({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                password: hashedPassword,
                isMember: false,
                isAdmin: (userInfo.isAdmin === "true")
            });

            newUser.save((err) => {
                if (err) {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                }
                console.log('User saved to database.');
            });
            res.redirect('/login');
        }
    });
}];

exports.getProfile = (req, res, next) => {
    const user = req.user;
    User.findById(user._id)
        .then(user => {
            throw 'Dummy Error';
            res.render('Profile', {
                firstName: user.firstName, 
                lastName: user.lastName, 
                posts: user.posts
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
} 
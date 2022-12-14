const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const getRegistrationMessage = require('../utils/registrationMessage');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.getHome = (req, res, next) => {
    // If a user is logged in, redirect to posts instead of the home page
    if (req.user) {
        res.status(302).redirect('/posts');
    } else {
        res.status(200).render('home');
    }
};

exports.getLogin = (req, res, next) => {
    res.status(200).render('login', {message: req.flash('error')});
};

exports.getLogout = (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.status(302).redirect("/");
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
        return res.status(200).render('login', {message: null, validationErrors: errors.array()});
    } else {
        passport.authenticate("local", {
            failureFlash: true,
            successRedirect: "/",
            failureRedirect: "/login"
        })(req,res);
    }
}];

exports.getRegister = (req, res, next) => {
    res.status(200).render('register');
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
(req, res, next) => {
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
                return res.status(422).render('register', {validationErrors: errors.array()});
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
                sgMail
                  .send(getRegistrationMessage(userInfo.email))
                  .then((response) => {
                        console.log(response[0].statusCode)
                        console.log(response[0].headers)
                  })
                  .catch((err) => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                  })
            });
            res.status(302).redirect('/login');
        }
    });
}];

exports.getProfile = (req, res, next) => {
    const user = req.user;
    User.findById(user._id)
        .then(user => {
            res.status(200).render('Profile', {
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

// exports.postProfilePicture = (req, res, next) => {

//     const user = req.user;
//     const imgData = {
//         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//         contentType: 'image/png'
//     }

//     user.profileImage = imgData;
//     user.save()
//         .then(savedUser => {
//             if (!(savedUser === user)) {
//                 const error = new Error(err);
//                 error.httpStatusCode = 500;
//                 return next(error);
//             } else {
//                 res.status(302).redirect('/profile');
//             }
//     });
// }
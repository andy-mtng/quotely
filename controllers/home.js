const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getHome = (req, res) => {
    res.render('home');
};

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.getLogout = (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
}

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.registerPost = (req, res) => {
    const userInfo = req.body;

    // Use bcrypt to convert the plaintext password into a secure oen
    bcrypt.hash(userInfo.password, 10, (err, hashedPassword) => {
        if (err) {
            console.log(err);
        } else {
            const newUser = new User({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                password: hashedPassword,
                isMember: false,
                isAdmin: (userInfo.isAdmin === "true")
            });

            newUser.save((err) => {
                if (err) {console.log(err)}
                console.log('User saved to database.');
            });
            res.redirect('/login');
        }
    });
};
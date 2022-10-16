const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const User = require('../models/user');

exports.getPassReset = (req, res, next) => {
        res.status(200).render('passReset');
}

exports.postPassReset = (req, res, next) => {
        crypto.randomBytes(32, (err, buffer) => {
          if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
                return res.status(302).redirect('/password-reset');
          }
          const token = buffer.toString('hex');
          User.findOne({ email: req.body.email })
            .then(user => {
              if (!user) {
                return res.status(302).redirect('/reset');
              }
              user.resetToken = token;
              user.resetTokenExpiration = Date.now() + 3600000;
              return user.save();
            })
            .then(result => {
                // res.redirect('/');
                sgMail
                        .send({
                                to: req.body.email,
                                from: 'no-reply@quotely.com',
                                subject: 'Password reset',
                                html: `
                                <p>You requested a password reset.</p>
                                <p>Click this <a href="http://localhost:3000/password-reset/${token}">link</a> to set a new password.</p>
                                `
                        })
                        .then((response) => {
                                console.log(response[0].statusCode)
                                console.log(response[0].headers)
                        })
                        .catch((err) => {
                                const error = new Error(err);
                                error.httpStatusCode = 500;
                                return next(error);
                        })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        });
};      

exports.getNewPassword = (req, res, next) => {
        const token = req.params.token;
        User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
                .then(user => {
                        res.status(200).render('newPassword', {userId: user._id.toString(), passwordToken: token
                });
          })
          .catch(err => {
                console.log('Hit');
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);              
        });
};

exports.postNewPassword = (req, res, next) => {
        const newPassword = req.body.newPassword;
        const userId = req.body.userId;
        const passwordToken = req.body.passwordToken;
        let resetUser;
      
        User.findOne({
          resetToken: passwordToken,
          resetTokenExpiration: { $gt: Date.now() },
          _id: userId
        })
          .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
          })
          .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
          })
          .then(result => {
            res.status(302).redirect('/login');
          })
          .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
          });
};
      
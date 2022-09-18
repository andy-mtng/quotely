const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const postRoutes = require('./routes/posts');
const homeRoutes = require('./routes/home');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

// Libraries needed for user authentication
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

// Connect to mongoDB
const mongoDB = 'mongodb+srv://dante:dante@cluster0.cpcqfyc.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error.'));


// Set ejs as the view engine
app.set('view engine', 'ejs');


// Passport Authentication Functions
// Set up the local strategy for authentication
// You need to set up the options usernameField and passwordField to let local strat know you are using an email instead of password
passport.use(
    new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
        if (err) { 
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "Incorrect email" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              // Passwords match! log user in
              return done(null, user)
            } else {
              // Passwords do not match!
              return done(null, false, { message: "Incorrect password" })
            }
        });
      });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Lets you serve static css files (located in public directory)
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) { // Allows us to access the currently logged in user in the views as "currentUser"
    res.locals.currentUser = req.user;
    next();
});
// app.use((req, res, next) => { 
//     req.session.user = req.user;
//     next();
// });
app.use(bodyParser.urlencoded({extended: false}));


// Routes
app.use('/posts', postRoutes);
app.use('/', homeRoutes);


app.listen(5000, () => {
    console.log('Listening on port 5000.');
});
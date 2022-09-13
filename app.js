const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const postRoutes = require('./routes/posts');
const homeRoutes = require('./routes/home');

const app = express();

// Connect to mongoDB
const mongoDB = 'mongodb+srv://dante:dante@cluster0.cpcqfyc.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error.'));


app.set('view engine', 'ejs');


// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))); // Lets you serve static css files (located in public directory)


// Routes
app.use('/posts', postRoutes);
app.use('/', homeRoutes);


app.listen(5000, () => {
    console.log('Listening on port 5000.');
})
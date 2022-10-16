const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { _, postSchema} = require('./post');

const UserSchema = Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isMember: {type: Boolean, required: true}, 
    isAdmin: {type: Boolean, required: true},
    resetToken: String,
    resetTokenExpiration: Date,
    posts: [postSchema],
    profileImg: {data: Buffer, contentType: String}
});

module.exports = mongoose.model('user', UserSchema);
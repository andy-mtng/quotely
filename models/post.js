const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
    title: {type: String, required: true},
    timeStamp: {type: Date, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('post', PostSchema);
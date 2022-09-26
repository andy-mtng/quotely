const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    timeStamp: {type: Date, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true}
});

module.exports = {
    postModel: mongoose.model('post', PostSchema),
    postSchema: PostSchema
}
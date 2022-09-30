const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { format } = require('date-fns');

const PostSchema = Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    timeStamp: {type: Date, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true}
});

PostSchema.virtual('formattedDate').get(function() {
    return format(this.timeStamp, 'MMM. d | p');
    // format(new Date(2017, 10, 6), 'MMM')
});

module.exports = {
    postModel: mongoose.model('post', PostSchema),
    postSchema: PostSchema
}
const Post = require('../models/post');
const { body, validationResult } = require("express-validator");

exports.getPosts = (req, res) => {
    Post.find()
        .populate('author')
        .exec((err, allPosts) => {
            if (err) {
                console.log(err);
            } else {
                res.render('posts', {allPosts: allPosts});
            }
        });
}

exports.getCreatePosts = (req, res) => {
    res.render('createPost');
}

exports.postCreatePost = [
body('title').isLength({min: 1}),
body('content').isLength({min: 1}),
(req, res) => {
    const postContent = req.body;
    const user = req.user;
    const errors = validationResult(req);

    console.log(errors);
    if (!errors.isEmpty()) {
        return res.render('createPost', {errors: errors.array()});
    }

    const post = new Post({
        title: postContent.title,
        content: postContent.content,
        timeStamp: new Date(),
        author: user._id
    });

    post.save((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Post saved to database');
            res.redirect('/posts');
        }
    });
}];

exports.getEditPost = (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            res.render('editPost', {post: post});
        })
        .catch((err) => {
            console.log('err');
            res.redirect('/');
        });
}

exports.deletePost = (req, res) => {
    Post.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('/posts');
        })
        .catch((err) => {
            console.log('err');
            res.redirect('/posts');
        });
}

exports.postEditPost = (req, res) => {
    const editedInfo = req.body;
    Post.findById(req.params.id)
        .then((post) => {
            post.title = editedInfo.title;
            post.content = editedInfo.content;
            post.timeStamp = new Date();
            post.author = req.user._id;

            post.save();
        })
        .catch((err) => {
            console.log(err);
        });
        res.redirect('/posts');
}
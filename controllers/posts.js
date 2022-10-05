const Post = require('../models/post');
const { body, validationResult } = require("express-validator");
const User = require('../models/user');

exports.getPosts = (req, res) => {
    Post.postModel.find()
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
body('title', 'Title cannot be empty.').trim().isLength({min: 1}).escape(),
body('content', 'Content cannot be empty.').trim().isLength({min: 1}).escape(),
(req, res) => {
    const postContent = req.body;
    const user = req.user;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('createPost', {errors: errors.array()});
    }

    const post = new Post.postModel({
        title: postContent.title,
        content: postContent.content,
        timeStamp: new Date(),
        author: user._id
    });
    post.save((err) => {
        if (err) {
            console.log(err);
        } else {
            user.posts.push(post);
            user.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Post saved to database');
                    res.redirect('/posts');
                }
            });

        }
    });
}];

exports.getEditPost = (req, res) => {
    Post.postModel.findById(req.params.id)
        .then((post) => {
            res.render('editPost', {post: post});
        })
        .catch((err) => {
            console.log('err');
            res.redirect('/');
        });
}

exports.deletePost = (req, res) => {
    const user = req.user;

    Post.postModel.deleteOne({ _id: req.params.id })
        .then(() => {
            // Remove the post subdocument from the user posts array
            user.posts.id(req.params.id).remove();
            user.save((err) => {
                if (err) console.log(err);
                res.redirect('/posts');
              });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/posts');
        });
}

exports.postEditPost = (req, res) => {
    const editedInfo = req.body;
    const user = req.user;

    // User.findById(req.params.id)
    //     .then((user) => {
    //         user.posts.id(req.params.id).title = editedInfo.title;
    //         user.posts.id(req.params.id).content = editedInfo.content;
    //         user.posts.id(req.params.id).timeStamp = new Date();
    //         user.posts.id(req.params.id).author = req.user._id;

    //         user.save();
    //         res.redirect('/posts');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.redirect('/posts');
    //     });
    


    Post.postModel.findById(req.params.id)
        .then((post) => {
            // Update the post with edited information
            post.title = editedInfo.title;
            post.content = editedInfo.content;
            post.timeStamp = new Date();
            post.author = req.user._id;

            // Update subdocument in user posts array with edited information
            user.posts.id(req.params.id).title = editedInfo.title;
            user.posts.id(req.params.id).content = editedInfo.content;
            user.posts.id(req.params.id).timeStamp = new Date();
            user.posts.id(req.params.id).author = req.user._id;

            post.save();
            user.save();
        })
        .catch((err) => {
            console.log(err);
        });
        res.redirect('/posts');
}
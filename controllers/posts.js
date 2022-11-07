const Post = require('../models/post');
const { body, validationResult } = require("express-validator");
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
    Post.postModel.find()
        .populate('author')
        .exec((err, allPosts) => {
            if (err) {
                console.log('PROBLEM');
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            } else {
                res.status(200).render('posts', {allPosts: allPosts});
            }
        });
}

exports.getCreatePosts = (req, res, next) => {
    res.status(200).render('createPost');
}

exports.postCreatePost = [
body('title', 'Title cannot be empty.').trim().isLength({min: 1}).escape(),
body('content', 'Content cannot be empty.').trim().isLength({min: 1}).escape(),
(req, res, next) => {
    const postContent = req.body;
    const user = req.user;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('createPost', {errors: errors.array()});
    }

    const post = new Post.postModel({
        title: postContent.title,
        content: postContent.content,
        timeStamp: new Date(),
        author: user._id
    });
    post.save((err) => {
        if (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        } else {
            user.posts.push(post);
            user.save((err) => {
                if (err) {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                } else {
                    console.log('Post saved to database');
                    res.status(201).redirect('/posts');
                }
            });

        }
    });
}];

exports.getEditPost = (req, res, next) => {
    Post.postModel.findById(req.params.id)
        .then((post) => {
            res.status(200).render('editPost', {post: post});
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deletePost = (req, res, next) => {
    const user = req.user;

    Post.postModel.deleteOne({ _id: req.params.id })
        .then(() => {
            // Remove the post subdocument from the user posts array
            user.posts.id(req.params.id).remove();
            user.save((err) => {
                if (err) {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                }
                res.status(302).redirect('/posts');
              });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postEditPost = (req, res, next) => {
    const editedInfo = req.body;
    const user = req.user;

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

            res.status(200).redirect('/posts');
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}
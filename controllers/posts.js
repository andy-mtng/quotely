const Post = require('../models/post');

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

exports.postCreatePost = (req, res) => {
    const postContent = req.body;
    const user = req.user;

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
            res.redirect('/');
        }
    });
}

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
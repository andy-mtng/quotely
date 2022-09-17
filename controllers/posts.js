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
    res.render('editPost');
}

exports.editPost = (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            console.log(post);
        })
        .catch((err) => {
            console.log(err);
        });
}
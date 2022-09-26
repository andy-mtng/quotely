const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const isLoggedIn = require('../utils/isLoggedIn');

router.get('/', postsController.getPosts);

router.get('/create', isLoggedIn, postsController.getCreatePosts);

router.post('/create', isLoggedIn, postsController.postCreatePost);

router.get('/:id/edit', isLoggedIn, postsController.getEditPost);

router.post('/:id/edit', isLoggedIn, postsController.postEditPost);

router.post('/:id/delete', isLoggedIn, postsController.deletePost);

module.exports = router;
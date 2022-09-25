const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const isLoggedIn = require('../utils/isLoggedIn');

router.get('/', postsController.getPosts);

router.get('/create', isLoggedIn, postsController.getCreatePosts);

router.post('/create', postsController.postCreatePost);

router.get('/:id/edit', postsController.getEditPost);

router.post('/:id/edit', postsController.postEditPost);

router.post('/:id/delete', postsController.deletePost);

module.exports = router;
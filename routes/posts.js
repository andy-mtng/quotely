const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');

router.get('/', postsController.getPosts);

router.get('/create', postsController.getCreatePosts);

router.post('/create', postsController.postCreatePost);

router.get('/:id/edit', postsController.getEditPost);

router.post('/:id/edit', postsController.getEditPost);

module.exports = router;
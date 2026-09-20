const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.put('/posts/:id/like', postController.likePost);
router.delete('/posts/:id', postController.deletePost);
router.post('/posts/:id/comments', postController.addComment);

module.exports = router;
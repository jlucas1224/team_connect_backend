const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Rotas de Post
router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);

// Rota para curtir/descurtir um post específico
router.post('/:postId/like', postController.toggleLike);

// Rota para buscar todos os comentários de um post específico
router.get('/:postId/comments', postController.getCommentsForPost);

// Rota para criar um novo comentário em um post específico
router.post('/:postId/comments', postController.createComment);

module.exports = router;
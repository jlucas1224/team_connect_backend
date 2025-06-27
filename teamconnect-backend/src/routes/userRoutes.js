const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para listar todos os usuário
router.get('/', userController.getAllUsers);

// Rota para buscar um usuário específico pelo ID
router.get('/:id', userController.getUserById);

// Rota para criar um novo usuário
router.post('/', userController.createUser);

module.exports = router;
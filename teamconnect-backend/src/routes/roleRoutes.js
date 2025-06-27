const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Rota para criar um novo cargo
router.post('/', roleController.createRole);

// Rota para listar todos os cargos de uma empresa específica
router.get('/company/:companyId', roleController.getRolesByCompany);

// Rota para atualizar um cargo específico
router.put('/:id', roleController.updateRole);

// Rota para deletar um cargo específico
router.delete('/:id', roleController.deleteRole);

module.exports = router;
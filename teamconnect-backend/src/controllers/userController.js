// src/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    const companyId = parseInt(req.headers['x-company-id']);
    if (!companyId) {
        return res.status(400).json({ error: "Header 'x-company-id' é obrigatório para simular o tenant." });
    }

    try {
        const { search } = req.query;
        const whereClause = { companyId };

        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            select: { id: true, name: true, email: true, role: { select: { name: true } }, department: { select: { name: true } } }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
};

// Admin cria um novo funcionário para SUA PRÓPRIA EMPRESA
const createEmployee = async (req, res) => {
    const companyId = parseInt(req.headers['x-company-id']);
    if (!companyId) {
        return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });
    }

    const { name, email, password, roleId, departmentId } = req.body;
    if (!name || !email || !password || !roleId) {
        return res.status(400).json({ error: "Nome, email, senha e roleId são obrigatórios." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password_hash: hashedPassword,
                companyId,
                roleId,
                departmentId
            }
        });
        const { password_hash, ...safeUser } = newUser;
        res.status(201).json(safeUser);
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: 'Email já cadastrado.' });
        res.status(500).json({ error: 'Erro ao criar funcionário.', details: error.message });
    }
};

const getUserById = async (req, res) => {
    const companyId = parseInt(req.headers['x-company-id']);
    if (!companyId) return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });
    
    const { id } = req.params;

    try {
        const user = await prisma.user.findFirst({
            where: { 
                id: parseInt(id),
                companyId: companyId 
            },
        });

        if (!user) return res.status(404).json({ error: "Usuário não encontrado nesta empresa." });
        
        const { password_hash, ...safeUser } = user;
        res.status(200).json(safeUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.', details: error.message });
    }
};


module.exports = {
    getAllUsers,
    createEmployee, 
    getUserById,
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRole = async (req, res) => {
    const companyId = parseInt(req.headers['x-company-id']);
    if (!companyId) return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });

    const { name, accessLevelId } = req.body;
    if (!name || !accessLevelId) return res.status(400).json({ error: "Nome e accessLevelId são obrigatórios." });

    try {
        const newRole = await prisma.role.create({ data: { name, accessLevelId, companyId } });
        res.status(201).json(newRole);
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ error: `O cargo "${name}" já existe nesta empresa.` });
        res.status(500).json({ error: "Erro ao criar cargo.", details: error.message });
    }
};

const getAllRoles = async (req, res) => {
    const companyId = parseInt(req.headers['x-company-id']);
    if (!companyId) return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });

    try {
        const roles = await prisma.role.findMany({
            where: { companyId },
            include: { accessLevel: { select: { name: true } }, _count: { select: { users: true } } }
        });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar cargos.", details: error.message });
    }
};

const updateRole = async (req, res) => { /* ... */ };
const deleteRole = async (req, res) => { /* ... */ };


module.exports = {
    createRole,
    getAllRoles,
    updateRole,
    deleteRole
};
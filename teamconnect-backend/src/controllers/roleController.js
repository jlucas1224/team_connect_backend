const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar um novo cargo
const createRole = async (req, res) => {
    const { name, accessLevelId, companyId } = req.body;

    if (!name || !accessLevelId || !companyId) {
        return res.status(400).json({ error: "Nome, accessLevelId e companyId são obrigatórios." });
    }

    try {
        const newRole = await prisma.role.create({
            data: {
                name,
                accessLevelId,
                companyId
            }
        });
        res.status(201).json(newRole);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `O cargo "${name}" já existe nesta empresa.` });
        }
        res.status(500).json({ error: "Erro ao criar cargo.", details: error.message });
    }
};

// Listar todos os cargos de uma empresa
const getRolesByCompany = async (req, res) => {
    const { companyId } = req.params;

    try {
        const roles = await prisma.role.findMany({
            where: { companyId: parseInt(companyId) },
            include: {
                accessLevel: { 
                    select: { name: true }
                },
                _count: { 
                    select: { users: true }
                }
            }
        });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar cargos.", details: error.message });
    }
};

// Atualizar um cargo
const updateRole = async (req, res) => {
    const { id } = req.params;
    const { name, accessLevelId } = req.body;

    try {
        const updatedRole = await prisma.role.update({
            where: { id: parseInt(id) },
            data: {
                name,
                accessLevelId
            }
        });
        res.status(200).json(updatedRole);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `O cargo "${name}" já existe nesta empresa.` });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Cargo não encontrado." });
        }
        res.status(500).json({ error: "Erro ao atualizar cargo.", details: error.message });
    }
};

// Deletar um cargo
const deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.role.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send(); 
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Cargo não encontrado." });
        }
        res.status(500).json({ error: "Erro ao deletar cargo.", details: error.message });
    }
};


module.exports = {
    createRole,
    getRolesByCompany,
    updateRole,
    deleteRole
};
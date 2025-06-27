const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para listar usuários com busca e filtro
const getAllUsers = async (req, res) => {
  try {
    const { department, search } = req.query;

    const whereClause = {};

    if (department) {
      whereClause.department = {
        equals: department,
        mode: 'insensitive',
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause, 
      select: {
        id: true,
        name: true,
        email: true,
        avatar_initials: true,
        role: true,
        department: true,
        is_online: true,
      }
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
};


// Função para buscar um único usuário pelo ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params; 

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                company: {
                    select: { name: true }
                },
                _count: {
                    select: { 
                        posts: true, 
                        likes: true, 
                        kudos_received: true, 
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const { password_hash, ...safeUser } = user;

        res.status(200).json(safeUser);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
}


// Função para criar um novo usuário
const createUser = async (req, res) => {
  try {
    const { companyName, userName, userEmail, userPassword } = req.body;

    const newCompany = await prisma.company.create({
      data: { name: companyName },
    });

    const newUser = await prisma.user.create({
      data: {
        name: userName,
        email: userEmail,
        password_hash: userPassword,
        companyId: newCompany.id,
      },
    });

    res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }
    res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
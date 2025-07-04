const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Função de REGISTRO DA EMPRESA E SEU ADMIN
const registerCompany = async (req, res) => {
  const { companyName, adminName, adminEmail, adminPassword } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: { name: companyName },
      });

      const adminAccessLevel = await tx.accessLevel.findUnique({
        where: { name: 'Admin' },
      });
      if (!adminAccessLevel) {
        throw new Error("Nível de acesso 'Admin' não encontrado. Rode o 'db seed'.");
      }

      const adminRole = await tx.role.create({
        data: {
          name: 'Administrador',
          companyId: company.id,
          accessLevelId: adminAccessLevel.id,
        },
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const adminUser = await tx.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password_hash: hashedPassword,
          companyId: company.id,
          roleId: adminRole.id, 
        },
      });

      return { company, adminUser };
    });

    res.status(201).json({
      message: 'Empresa registrada com sucesso!',
      companyId: result.company.id,
      adminId: result.adminUser.id,
    });

  } catch (error) {
    if (error.code === 'P2002') { 
      return res.status(409).json({ error: 'Este email já está sendo utilizado.' });
    }
    res.status(500).json({ error: 'Erro ao registrar empresa.', details: error.message });
  }
};

module.exports = {
  registerCompany,
};
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding...');

  // 1. Criar Permissões
  const manageUsers = await prisma.permission.upsert({
    where: { action: 'manage_users' },
    update: {},
    create: { action: 'manage_users', description: 'Pode criar, editar e deletar usuários' },
  });

  const manageRoles = await prisma.permission.upsert({
    where: { action: 'manage_roles' },
    update: {},
    create: { action: 'manage_roles', description: 'Pode criar e editar cargos e permissões' },
  });

  const createPosts = await prisma.permission.upsert({
    where: { action: 'create_posts' },
    update: {},
    create: { action: 'create_posts', description: 'Pode criar posts e eventos' },
  });

  console.log('Permissões criadas.');

  // 2. Criar Níveis de Acesso e conectar as permissões
  const adminLevel = await prisma.accessLevel.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Acesso total ao sistema',
      permissions: {
        connect: [
          { id: manageUsers.id },
          { id: manageRoles.id },
          { id: createPosts.id },
        ],
      },
    },
  });

  const memberLevel = await prisma.accessLevel.upsert({
    where: { name: 'Membro' },
    update: {},
    create: {
      name: 'Membro',
      description: 'Acesso básico para colaboradores',
      permissions: {
        connect: [{ id: createPosts.id }],
      },
    },
  });

  console.log('Níveis de Acesso criados.');
  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
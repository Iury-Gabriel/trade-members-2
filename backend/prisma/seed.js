const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Sm4rtTr4de@2026!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@trade.com' },
    update: { password: hashedPassword, is_admin: true },
    create: {
      email: 'admin@trade.com',
      password: hashedPassword,
      is_admin: true,
      ja_registrado: true,
    },
  });

  console.log('Admin criado:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

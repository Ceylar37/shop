import {PrismaClient, Role} from '@prisma/client';

const initDatabase = async (prisma: PrismaClient) => {
  const admin = await prisma.user.findFirst({
    where: {
      name: 'admin',
    },
  });
  if (!admin) {
    await prisma.user.create({
      data: {
        name: 'admin',
        role: Role.ADMIN,
        password: 'admin',
      },
    });
  }
};

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  prisma = global.prisma ?? new PrismaClient();
  // @ts-ignore
  global.prisma = prisma;
} else {
  prisma = new PrismaClient();
}
initDatabase(prisma);

export default prisma;

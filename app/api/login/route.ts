import { PrismaClient } from "@prisma/client";

export const POST = async (req: Request) => {
  const prisma = new PrismaClient();
  const { id, name, photo } = await req.json();
  console.log(id, name, photo);

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id,
        name,
        photo,
      },
    });
  }

  await prisma.$disconnect();
  return Response.json({
    id,
    name,
    photo,
  });
};

import { PrismaClient } from "@prisma/client";

export const POST = async (req: Request) => {
  const prisma = new PrismaClient();
  const { ownerId, startTime, endTime } = await req.json();
  const owner = await prisma.user.findUnique({
    where: {
      id: ownerId,
    },
  });
  const room = await prisma.room.create({
    data: {
      owner: {
        connect: {
          id: ownerId,
        },
      },
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      realEndTime: new Date(
        new Date(endTime).getTime() + Math.random() * 1000 * 60 * 30,
      ),
    },
  });

  await prisma.usersOnRooms.create({
    data: {
      user: {
        connect: {
          id: ownerId,
        },
      },
      room: {
        connect: {
          id: room.id,
        },
      },
      isAdmin: true,
    },
  });

  await prisma.$disconnect();
  return room;
};

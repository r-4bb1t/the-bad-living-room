import { BOMB_EXPIRE_TIME } from "@/constant";

import { PrismaClient } from "@prisma/client";

export const POST = async (req: Request) => {
  const prisma = new PrismaClient();
  const {
    sender: senderId,
    receiver: receiverId,
    bomb: bombId,
    text,
  } = await req.json();

  const sender = await prisma.user.findUnique({
    where: {
      id: senderId,
    },
    select: {
      bombs: true,
    },
  });

  const receiver = await prisma.user.findUnique({
    where: {
      id: receiverId,
    },
    select: {
      bombs: true,
    },
  });

  const bomb = await prisma.bomb.findUnique({
    where: {
      id: bombId,
    },
  });

  if (!sender || !receiver || !bomb) {
    return Response.json({
      error: "Invalid sender, receiver or bomb",
    });
  }

  if (new Date(bomb.time).getTime() + BOMB_EXPIRE_TIME < new Date().getTime()) {
    return Response.json({
      error: "Bomb is expired",
    });
  }

  await prisma.bomb.update({
    where: {
      id: bombId,
    },
    data: {
      owner: {
        connect: {
          id: receiverId,
        },
      },
      time: new Date(),
      via: [...bomb.via, senderId],
      text: [...bomb.text, text],
      senderId,
      opened: false,
    },
  });

  await prisma.usersOnRooms.update({
    where: {
      roomId_userId: {
        roomId: bomb.roomId,
        userId: senderId,
      },
    },
    data: {
      sends: {
        increment: 1,
      },
    },
  });

  await prisma.$disconnect();
  return Response.json({});
};

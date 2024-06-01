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
  });

  const receiver = await prisma.user.findUnique({
    where: {
      id: receiverId,
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

  if (new Date(bomb.time).getTime() + 1000 * 60 * 30 < new Date().getTime()) {
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
    },
  });

  await prisma.receiver.update({
    where: {
      id: receiverId,
    },
    data: {
      bombs: [...receiver.bombs, bombId],
    },
  });

  await prisma.sender.update({
    where: {
      id: senderId,
    },
    data: {
      bombs: sender.bombs.filter((b) => b !== bombId),
    },
  });

  await prisma.$disconnect();
  return Response.json({});
};

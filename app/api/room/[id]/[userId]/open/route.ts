import { nanoid } from "nanoid";

import { PrismaClient } from "@prisma/client";

export const POST = async (
  req: Request,
  { params }: { params: { id: string; userId: string } },
) => {
  const prisma = new PrismaClient();
  const { id: roomId, userId } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const userOnRoom = await prisma.usersOnRooms.findFirst({
    where: { roomId, userId },
  });

  if (!userOnRoom || !user) {
    return Response.json({
      error: "User is not in the room",
    });
  }

  const now = new Date();
  const lastVisit = userOnRoom.lastVisit;

  console.log(lastVisit, now, lastVisit.getHours(), now.getHours());

  if (now.getHours() > lastVisit.getHours()) {
    const count = now.getHours() - lastVisit.getHours();
    for (let i = 0; i < count; i++) {
      await prisma.bomb.create({
        data: {
          id: nanoid(),
          originalUserId: userId,
          ownerId: userId,
          senderId: userId,
          opened: false,
          roomId,
          time: new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            lastVisit.getHours() + i + 1,
          ),
        },
      });
    }
  }

  await prisma.usersOnRooms.update({
    where: {
      roomId_userId: {
        roomId,
        userId,
      },
    },
    data: {
      lastVisit: now,
    },
  });

  const unopened = await prisma.bomb.findMany({
    where: {
      roomId,
      ownerId: userId,
      opened: false,
    },
  });

  await prisma.bomb.updateMany({
    where: {
      roomId,
      ownerId: userId,
    },
    data: {
      opened: true,
    },
  });

  return Response.json({ bombs: unopened });
};

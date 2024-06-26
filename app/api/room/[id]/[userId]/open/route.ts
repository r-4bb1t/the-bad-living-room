import { nanoid } from "nanoid";

import { BOMB_COOLTIME } from "@/constant";

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

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!userOnRoom || !user || !room) {
    // await prisma.$disconnect();
    return Response.json({
      error: "User is not in the room",
    });
  }

  const now = new Date();
  const lastVisit = userOnRoom.lastVisit;
  const startTime = room.startTime;

  if (now.getTime() > lastVisit.getTime()) {
    const allCnt = Math.floor(
      (now.getTime() - startTime.getTime()) / BOMB_COOLTIME,
    );
    const openedCnt = Math.floor(
      (lastVisit.getTime() - startTime.getTime()) / BOMB_COOLTIME,
    );
    for (let i = 0; i < allCnt - openedCnt; i++) {
      await prisma.bomb.create({
        data: {
          id: nanoid(),
          originalUserId: userId,
          ownerId: userId,
          senderId: userId,
          opened: false,
          roomId,
          time: new Date(
            startTime.getTime() + BOMB_COOLTIME * (openedCnt + i + 1),
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
      visits: {
        increment: 1,
      },
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

  // await prisma.$disconnect();
  return Response.json({ bombs: unopened });
};

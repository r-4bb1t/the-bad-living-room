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
    // startTime 기준으로 1시간에 1개씩 폭탄 생성
    const allCnt = Math.floor(
      (now.getTime() - startTime.getTime()) / (1000 * 60 * 60),
    );
    const openedCnt = Math.floor(
      (lastVisit.getTime() - startTime.getTime()) / (1000 * 60 * 60),
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
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            startTime.getHours() + openedCnt + i + 1,
            startTime.getMinutes(),
            startTime.getSeconds(),
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

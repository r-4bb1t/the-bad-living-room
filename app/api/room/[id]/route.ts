import { nanoid } from "nanoid";

import { BOMB_COOLTIME } from "@/constant";
import { EndType } from "@/types/room";

import { PrismaClient } from "@prisma/client";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const prisma = new PrismaClient();

  const { id } = params;
  const room = await prisma.room.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      realEndTime: true,
      ended: true,
      owner: {
        select: {
          name: true,
        },
      },
      UsersOnRooms: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
        },
      },
    },
  });

  if (!room) {
    // await prisma.$disconnect();
    return Response.json({
      message: "Room not found",
    });
  }

  const usersOnRoom = await prisma.usersOnRooms.findMany({
    where: {
      roomId: id,
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
      lastVisit: true,
    },
  });

  const now = new Date();

  const bombs = await prisma.bomb.findMany({
    where: {
      roomId: id,
    },
    select: {
      originalUserId: true,
      ownerId: true,
      time: true,
      via: true,
      text: true,
    },
  });

  const end: EndType = {
    bombs,
    awards: [],
  };

  let maxBombCount = 0,
    maxBombUserId = usersOnRoom[0].user.id,
    minBombCount = 1000000000,
    minBombUserId = usersOnRoom[0].user.id,
    maxCecursiveCnt = 0,
    maxRecursiveUserId = usersOnRoom[0].user.id;

  const startTime = room.startTime;

  if (now > new Date(room.realEndTime)) {
    if (!room.ended) {
      usersOnRoom.forEach(async (uor) => {
        const lastVisit = uor.lastVisit;
        if (now.getHours() > uor.lastVisit.getHours()) {
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
                originalUserId: uor.user.id,
                ownerId: uor.user.id,
                senderId: uor.user.id,
                opened: false,
                roomId: id,
                time: new Date(
                  startTime.getTime() + BOMB_COOLTIME * (openedCnt + i + 1),
                ),
              },
            });
          }
        }
      });
      await prisma.room.update({
        where: {
          id,
        },
        data: {
          ended: true,
        },
      });
    }

    usersOnRoom.forEach(async (uor) => {
      const bombCnt = await prisma.bomb.count({
        where: {
          ownerId: uor.user.id,
        },
      });
      if (bombCnt > maxBombCount) {
        maxBombCount = bombCnt;
        maxBombUserId = uor.user.id;
      }
      if (bombCnt < minBombCount) {
        minBombCount = bombCnt;
        minBombUserId = uor.user.id;
      }

      const recursiveCnt = await prisma.bomb.count({
        where: {
          originalUserId: uor.user.id,
          ownerId: uor.user.id,
        },
      });

      if (recursiveCnt > maxCecursiveCnt) {
        maxCecursiveCnt = recursiveCnt;
        maxRecursiveUserId = uor.user.id;
      }

      await prisma.usersOnRooms.update({
        where: {
          roomId_userId: {
            roomId: id,
            userId: uor.user.id,
          },
        },
        data: {
          lastVisit: now,
        },
      });
    });

    const maxVisits = await prisma.usersOnRooms.findFirst({
      where: {
        roomId: id,
      },
      orderBy: {
        visits: "desc",
      },
    });

    const maxSends = await prisma.usersOnRooms.findFirst({
      where: {
        roomId: id,
      },
      orderBy: {
        sends: "desc",
      },
    });

    end.awards.push({
      title: "패배상",
      description: "패배했다.",
      userId: maxBombUserId,
    });
    end.awards.push({
      title: "봇치상",
      description: "폭탄을 받은 횟수가 가장 적다.",
      userId: minBombUserId,
    });
    if (maxCecursiveCnt > 0)
      end.awards.push({
        title: "아차상",
        description: "자신의 폭탄을 제일 많이 받았다.",
        userId: maxRecursiveUserId,
      });
    if (maxSends)
      end.awards.push({
        title: "개악질상",
        description: "보낸 폭탄의 수가 가장 많다.",
        userId: maxSends.userId,
      });
    if (maxVisits)
      end.awards.push({
        title: "휴대폰 중독상",
        description: "우편함 갱신을 가장 많이 했다.",
        userId: maxVisits.userId,
      });
  }

  // await prisma.$disconnect();
  return Response.json({
    id: room.id,
    ownerName: room.owner.name,
    startTime: room.startTime,
    endTime: room.endTime,
    status:
      now < new Date(room.startTime)
        ? "waiting"
        : now < new Date(room.realEndTime)
          ? "playing"
          : "end",
    users: room.UsersOnRooms.map((userOnRoom) => ({
      id: userOnRoom.user.id,
      name: userOnRoom.user.name,
      photo: userOnRoom.user.photo,
    })),
    end,
  });
};

export const dynamic = "force-dynamic";

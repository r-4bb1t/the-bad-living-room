import { nanoid } from "nanoid";

import { RANDOM_ADD_TIME } from "@/constant";

import { PrismaClient } from "@prisma/client";

export const POST = async (req: Request) => {
  const prisma = new PrismaClient();
  const { ownerId, startTime, endTime } = await req.json();
  const owner = await prisma.user.findUnique({
    where: {
      id: ownerId,
    },
  });
  let start = new Date();
  start.setHours(startTime);
  start.setMinutes(0);
  start.setSeconds(0);
  let end = new Date();
  end.setHours(endTime);
  end.setMinutes(0);
  end.setSeconds(0);

  const room = await prisma.room.create({
    data: {
      id: nanoid(),
      owner: {
        connect: {
          id: ownerId,
        },
      },
      UsersOnRooms: {
        create: {
          user: {
            connect: {
              id: ownerId,
            },
          },
          isAdmin: true,
          lastVisit: new Date(start.getTime() - 1000 * 60 * 20),
        },
      },
      startTime: start,
      endTime: end,
      realEndTime: new Date(end.getTime() + Math.random() * RANDOM_ADD_TIME),
    },
  });

  await prisma.$disconnect();
  return Response.json({
    id: room.id,
  });
};

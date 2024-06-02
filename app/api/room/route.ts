import { nanoid } from "nanoid";

import { POSTBOX_COOLTIME, RANDOM_ADD_TIME } from "@/constant";

import { PrismaClient } from "@prisma/client";

export const POST = async (req: Request) => {
  const prisma = new PrismaClient();
  const { ownerId, startTime, endTime } = await req.json();

  let start = new Date(startTime);
  let end = new Date(endTime);

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
          lastVisit: new Date(start.getTime() - POSTBOX_COOLTIME * 1.5),
        },
      },
      startTime: start,
      endTime: end,
      realEndTime: new Date(end.getTime() + Math.random() * RANDOM_ADD_TIME),
    },
  });

  // await prisma.$disconnect();
  return Response.json({
    id: room.id,
  });
};

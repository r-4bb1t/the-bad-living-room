import { POSTBOX_COOLTIME } from "@/constant";

import { PrismaClient } from "@prisma/client";

export const POST = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  const prisma = new PrismaClient();

  const { userId } = await req.json();

  const { id } = params;

  const room = await prisma.room.findUnique({
    where: {
      id,
    },
  });

  const userOnRoom = await prisma.usersOnRooms.findFirst({
    where: { roomId: id, userId },
  });

  if (!room || userOnRoom) {
    // await prisma.$disconnect();
    return Response.json({
      error: "Room not found or user is already in the room",
    });
  }

  await prisma.room.update({
    where: {
      id,
    },
    data: {
      UsersOnRooms: {
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          isAdmin: false,
          lastVisit: new Date(
            room.startTime.getTime() - POSTBOX_COOLTIME * 1.5,
          ),
        },
      },
    },
  });

  // await prisma.$disconnect();
  return Response.json({
    message: "User entered the room",
  });
};

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

  if (!room) {
    return Response.json({
      error: "Room not found",
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
          lastVisit: new Date(room.startTime.getTime() - 1000 * 60 * 20),
        },
      },
    },
  });

  return Response.json({
    message: "User entered the room",
  });
};

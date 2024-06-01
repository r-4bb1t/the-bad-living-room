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
    return Response.json({
      message: "Room not found",
    });
  }

  return Response.json({
    id: room.id,
    ownerName: room.owner.name,
    startTime: room.startTime,
    endTime: room.endTime,
    status:
      new Date() < new Date(room.startTime)
        ? "waiting"
        : new Date() < new Date(room.endTime)
          ? "playing"
          : "end",
    users: room.UsersOnRooms.map((userOnRoom) => ({
      id: userOnRoom.user.id,
      name: userOnRoom.user.name,
      photo: userOnRoom.user.photo,
    })),
  });
};

export const dynamic = "force-dynamic";

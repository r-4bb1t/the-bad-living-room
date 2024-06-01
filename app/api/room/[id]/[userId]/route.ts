import { PrismaClient } from "@prisma/client";

export const GET = async (
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

  const bombs = await prisma.bomb.findMany({
    where: { roomId, ownerId: userId },
  });

  return Response.json({ bombs, lastVisit: userOnRoom.lastVisit });
};

export const dynamic = "force-dynamic";

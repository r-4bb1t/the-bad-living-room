import End from "./end";
import Home from "./home";
import Landing from "./landing";

import type { RoomType } from "@/types/room";

const getRoomData = async (id: string) => {
  const res = await fetch(`${process.env.APP_HOST}/api/room/${id}`, {
    next: {
      revalidate: 1,
    },
  });
  const data: RoomType = await res.json();
  return data;
};

export default async function Room({
  params: { id },
}: {
  params: { id: string };
}) {
  const room = await getRoomData(id);
  return (
    <>
      {room.status === "waiting" && <Landing room={room} />}
      {room.status === "playing" && <Home room={room} />}
      {room.status === "end" && <End room={room} />}
    </>
  );
}

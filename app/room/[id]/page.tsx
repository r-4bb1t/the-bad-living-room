"use client";

import { useCallback, useEffect, useState } from "react";

import End from "./end";
import Home from "./home";
import Landing from "./landing";

import { RoomType } from "@/types/room";

export default function Room({ params: { id } }: { params: { id: string } }) {
  const [room, setRoom] = useState<RoomType | null>(null);

  const getRoomData = useCallback(async () => {
    const res = await fetch(`/api/room/${id}`, {
      cache: "no-cache",
    });
    const data = await res.json();
    setRoom(data);
  }, [id]);

  useEffect(() => {
    getRoomData();
  }, [getRoomData]);

  return (
    <>
      {room?.status === "waiting" && <Landing room={room} />}
      {room?.status === "playing" && <Home room={room} />}
      {room?.status === "end" && <End room={room} />}
    </>
  );
}

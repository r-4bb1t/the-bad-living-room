"use client";

import { useEffect } from "react";

import RoomButton from "./button";
import { useRouter } from "next/navigation";

import Bomb from "@/components/bomb";
import RoomRule from "@/components/room/rule";
import Setting from "@/components/room/setting";
import type { RoomType } from "@/types/room";

export default function Landing({ room }: { room: RoomType }) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(
      () => {
        window.location.reload();
      },
      new Date(room.startTime).getTime() - new Date().getTime() + 100,
    );
  }, [router, room]);

  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center gap-4">
      <div className="text-lg">
        여기는 <span className="text-primary font-bold">{room.ownerName}</span>
        님이 초대한 의상한거실...
      </div>
      <div className="flex w-full justify-center flex-wrap gap-x-4">
        {room.users.map((user) => (
          <Bomb
            src={user.photo}
            key={user.id}
            rotate={(Math.random() - 0.5) * 90}
          />
        ))}
      </div>
      <Setting
        isEdit={false}
        startTime={new Date(room.startTime)}
        endTime={new Date(room.endTime)}
      />
      <RoomRule />
      <RoomButton roomId={room.id} userIds={room.users.map((u) => u.id)} />
    </main>
  );
}

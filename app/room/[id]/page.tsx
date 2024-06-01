import RoomButton from "./button";

import Bomb from "@/components/bomb";
import RoomRule from "@/components/room/rule";
import Setting from "@/components/room/setting";
import { RoomType } from "@/types/room";

const getRoomData = async (id: string) => {
  const res = await fetch(`${process.env.APP_HOST}/api/room/${id}`);
  const data: RoomType = await res.json();
  console.log(data);
  return data;
};

export default async function Room({
  params: { id },
}: {
  params: { id: string };
}) {
  const room = await getRoomData(id);
  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center gap-4">
      <div className="italic text-lg">
        여기는 <span className="text-primary">{room.ownerName}</span>님이 초대한
        의상한거실...
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
        startHour={new Date(room.startTime).getHours()}
        endHour={new Date(room.endTime).getHours()}
      />
      <RoomRule />
      <RoomButton roomId={room.id} userIds={room.users.map((u) => u.id)} />
    </main>
  );
}

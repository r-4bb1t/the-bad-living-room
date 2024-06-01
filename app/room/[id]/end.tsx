import Bomb from "@/components/bomb";
import { RoomType } from "@/types/room";

export default function End({ room }: { room: RoomType }) {
  return (
    <main className="pt-24 pb-12 px-8 h-screen flex flex-col items-center gap-4">
      <div className="text-lg">
        여기는 <span className="text-primary font-bold">{room.ownerName}</span>
        님이 초대한 의상한거실...
      </div>
      <div className="border border-primary border-dotted p-4 rounded flex flex-col gap-2 items-center">
        <h2 className="text-primary font-bold text-lg">시상식</h2>
        {room.end?.awards.map((award, index) => (
          <div key={index} className="flex flex-col gap-2 items-center">
            <div className="text-primary font-bold">{award.title}</div>
            <div className="text-sm">{award.description}</div>
          </div>
        ))}
      </div>

      <div className="border border-primary border-dotted p-4 rounded flex flex-col gap-2 items-center">
        <h2 className="text-primary font-bold text-lg">폭탄 경로</h2>
        {room.end?.bombs.map((bomb, index) => (
          <div key={index} className="flex flex-wrap items-center">
            <Bomb
              src={
                room.users.find((user) => user.id === bomb.originalUserId)
                  ?.photo
              }
            />
            {bomb.via.map((via, index) => (
              <div key={`via-${index}`}></div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

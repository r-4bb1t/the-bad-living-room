"use client";

import { Fragment } from "react";

import { ChevronRight } from "lucide-react";

import Bomb from "@/components/bomb";
import { RoomType } from "@/types/room";

export default function End({ room }: { room: RoomType }) {
  return (
    <main className="pt-24 pb-12 px-8 flex flex-col items-center gap-4">
      <div className="text-lg">
        여기는 <span className="text-primary font-bold">{room.ownerName}</span>
        님이 초대한 의상한거실...
      </div>
      <div className="border border-primary border-dotted p-4 rounded flex flex-col gap-2 items-center w-full">
        <h2 className="text-primary font-bold text-lg">시상식</h2>
        {room.end?.awards.map((award, index) => (
          <div key={index} className="flex flex-col gap-2 items-center">
            <div className="text-primary font-bold">{award.title}</div>
            <Bomb
              src={room.users.find((user) => user.id === award.userId)?.photo}
              win
            />
            <div className="text-sm">{award.description}</div>
          </div>
        ))}
      </div>

      <div className="border border-primary border-dotted p-4 rounded flex flex-col gap-2 items-center w-full">
        <h2 className="text-primary font-bold text-lg">폭탄 경로</h2>
        {room.end?.bombs.map((bomb, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between items-center text-primary w-full"
          >
            <Bomb
              src={
                room.users.find((user) => user.id === bomb.originalUserId)
                  ?.photo
              }
              small
            />
            {bomb.via.length > 0 &&
              [...new Array(bomb.via.length - 1)].map((_, index) => (
                <Fragment key={`via-${index}`}>
                  <div className="flex flex-col gap-2 items-center relative w-12 text-primary">
                    <ChevronRight size={16} />
                    <div className="absolute top-[calc(100%+2px)] break-keep text-center w-20 text-xs">
                      {bomb.text[index]}
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={
                        room.users.find(
                          (user) => user.id === bomb.via[index + 1],
                        )?.photo
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Fragment>
              ))}
            {bomb.via.length > 0 && (
              <>
                <div className="flex flex-col gap-2 items-center relative w-24 text-primary">
                  <ChevronRight size={16} />
                  <div className="absolute top-[calc(100%+2px)] break-keep text-center w-20 text-xs">
                    {bomb.text[bomb.via.length - 1]}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-primary">
                  <img
                    src={
                      room.users.find((user) => user.id === bomb.ownerId)?.photo
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

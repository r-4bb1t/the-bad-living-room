"use client";

import { useCallback, useEffect, useState } from "react";

import Bomb from "@/components/bomb";
import RoomRule from "@/components/room/rule";
import Setting from "@/components/room/setting";
import { useUser } from "@/store/useUser";
import { BombType } from "@/types/bomb";
import { RoomType } from "@/types/room";

import { Button, useAlert } from "@r-4bb1t/rabbit-ui";

export default function Home({ room }: { room: RoomType }) {
  const { user } = useUser();
  const { openModal } = useAlert();
  const [loading, setLoading] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [bombs, setBombs] = useState<BombType[]>([]);
  const [lastVisit, setLastVisit] = useState<Date>(new Date());

  const getBomb = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/room/${room.id}/${user!.id}`);
      const { bombs: all, lastVisit: lv } = (await res.json()) as {
        bombs: BombType[];
        lastVisit: string;
      };
      setBombs(all.filter((b) => b.opened));
      setLastVisit(new Date(lv));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [user, room]);

  const open = useCallback(async () => {
    if (!user) return;
    setOpenLoading(true);
    try {
      const res = await fetch(`/api/room/${room.id}/${user!.id}/open`, {
        method: "POST",
      });
      const { bombs: opened } = (await res.json()) as { bombs: BombType[] };
      setBombs((bombs) => [...bombs, ...opened]);
    } catch (e) {
    } finally {
      setOpenLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) getBomb();
  }, [getBomb, user]);

  return (
    <main className="pt-24 pb-12 px-8 h-screen flex flex-col items-center gap-4">
      <div className="italic text-lg">
        여기는 <span className="text-primary">{room.ownerName}</span>님이 초대한
        의상한거실...
      </div>
      <div className="w-full flex gap-2 justify-center">
        <Button
          sz={"sm"}
          onClick={() =>
            openModal({
              children: (
                <div className="w-full flex flex-col gap-2">
                  <Setting
                    date={new Date()}
                    isEdit={false}
                    startHour={new Date(room.startTime).getHours()}
                    endHour={new Date(room.endTime).getHours()}
                  />
                  <RoomRule />
                </div>
              ),
              submitButtonText: "닫기",
              submitButtonAction: () => {},
            })
          }
          ghost
          fullWidth={false}
        >
          규칙 보기
        </Button>
      </div>
      {!loading && (
        <>
          <Button
            icon="Gift"
            sz="lg"
            fullWidth={false}
            onClick={open}
            disabled={
              new Date().getTime() - lastVisit!.getTime() < 1000 * 60 * 15
            }
            loading={openLoading}
          >
            확인하기
          </Button>
          {bombs.map((b) => (
            <Bomb
              key={b.id}
              src={room.users.find((u) => u.id === b.originalUserId)?.photo}
            />
          ))}
        </>
      )}
    </main>
  );
}

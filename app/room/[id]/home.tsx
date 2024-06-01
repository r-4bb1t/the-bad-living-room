"use client";

import { useCallback, useEffect, useState } from "react";

import SendBomb from "./sendBomb";

import RoomRule from "@/components/room/rule";
import Setting from "@/components/room/setting";
import { useUser } from "@/store/useUser";
import { BombType } from "@/types/bomb";
import { RoomType } from "@/types/room";

import { Button, Spinner, useAlert } from "@r-4bb1t/rabbit-ui";

export default function Home({ room }: { room: RoomType }) {
  const { user } = useUser();
  const { openModal, addToast } = useAlert();
  const [loading, setLoading] = useState(true);
  const [getFirst, setGetFirst] = useState(false);
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
      setGetFirst(true);
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
      if (opened.length === 0) {
        addToast({
          type: "info",
          text: "새로 도착한 폭탄이 없어요! 휴대폰을 적당히 내려놓고 쉬어가세요.",
        });
      } else {
        addToast({
          type: "success",
          text: "새로운 폭탄이 도착했어요!",
        });
      }
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
      <div className="text-lg">
        여기는 <span className="text-primary font-bold">{room.ownerName}</span>
        님이 초대한 의상한거실...
      </div>
      <div className="w-full flex gap-2 justify-center">
        <Button
          icon="Info"
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
      <Button
        icon="Mail"
        sz="lg"
        fullWidth={false}
        onClick={open}
        disabled={
          new Date().getTime() - lastVisit!.getTime() < 1000 * 60 * 15 ||
          loading ||
          !getFirst
        }
        loading={openLoading}
      >
        우편함 확인하기
      </Button>
      <div className="w-full rounded border border-primary border-dotted px-4 pt-2 pb-4 gap-4 flex flex-col items-center">
        <h2 className="text-center text-sm text-primary font-bold">
          내 폭탄함
        </h2>
        <div className="flex w-full justify-center flex-wrap gap-x-4">
          {getFirst ? (
            bombs.map((b) => (
              <SendBomb
                key={b.id}
                bomb={b}
                users={room.users}
                remove={() =>
                  setBombs((bombs) => bombs.filter((bb) => bb.id !== b.id))
                }
              />
            ))
          ) : (
            <div className="text-primary">
              <Spinner sz="lg" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

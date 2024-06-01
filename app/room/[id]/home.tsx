"use client";

import { useCallback, useEffect, useState } from "react";

import SendBomb from "./sendBomb";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import Bomb from "@/components/bomb";
import RoomRule from "@/components/room/rule";
import Setting from "@/components/room/setting";
import { POSTBOX_COOLTIME } from "@/constant";
import { useUser } from "@/store/useUser";
import { BombType } from "@/types/bomb";
import { RoomType } from "@/types/room";

import { Button, Spinner, useAlert } from "@r-4bb1t/rabbit-ui";

export default function Home({ room }: { room: RoomType }) {
  const { user } = useUser();
  const { openModal, addToast } = useAlert();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [getFirst, setGetFirst] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [bombs, setBombs] = useState<BombType[]>([]);
  const [lastVisit, setLastVisit] = useState<Date | null>(null);
  const [lastMinute, setLastMinute] = useState<number>(15);
  const [isTimeLimited, setIsTimelimited] = useState(true);

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
      setLastMinute(
        Math.floor(
          (POSTBOX_COOLTIME - (new Date().getTime() - new Date(lv).getTime())) /
            1000 /
            60,
        ),
      );
      setIsTimelimited(
        new Date().getTime() - new Date(lv).getTime() < POSTBOX_COOLTIME,
      );
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
          text: "새로 도착한 폭탄이 없어요!",
        });
      } else {
        addToast({
          type: "success",
          text: "새로운 폭탄이 도착했어요!",
        });
      }
      setBombs((bombs) => [...bombs, ...opened]);
      setLastVisit(new Date());
      setLastMinute(15);
      setIsTimelimited(true);
    } catch (e) {
    } finally {
      setOpenLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (!room.users.find((u) => u.id === user.id)) {
      router.push(`/`);
    } else if (room.users.length === 1) {
      openModal({
        children: "방에 아무도 없어서 게임을 시작할 수 없어요!",
        submitButtonText: "확인",
        submitButtonAction: () => {
          router.push(`/new`);
        },
      });
    }
    getBomb();
  }, [getBomb, user, room.users]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastVisit) return;
      setLastMinute(
        Math.floor(
          (POSTBOX_COOLTIME -
            (new Date().getTime() - new Date(lastVisit).getTime())) /
            1000 /
            60,
        ),
      );
      setIsTimelimited(
        new Date().getTime() - new Date(lastVisit).getTime() < POSTBOX_COOLTIME,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="pt-24 pb-12 px-8 h-screen flex flex-col items-center gap-4">
      <div className="text-lg">
        여기는 <span className="text-primary font-bold">{room.ownerName}</span>
        님이 초대한 의상한거실...
      </div>{" "}
      <Button
        icon="Info"
        sz={"sm"}
        onClick={() =>
          openModal({
            children: (
              <div className="w-full flex flex-col gap-2">
                <Setting
                  isEdit={false}
                  startTime={new Date(room.startTime)}
                  endTime={new Date(room.endTime)}
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
      <div className="flex w-full justify-center flex-wrap gap-x-4">
        {room.users.map((user) => (
          <Bomb small stop src={user.photo} key={user.id} />
        ))}
      </div>
      <Button
        icon="Mail"
        sz="lg"
        fullWidth={false}
        onClick={open}
        disabled={isTimeLimited || loading || !getFirst}
        loading={openLoading}
      >
        {isTimeLimited && getFirst
          ? "우편함 확인까지 " + lastMinute + "분"
          : "우편함 확인하기"}
      </Button>
      <div className="h-full overflow-auto w-full rounded border border-primary border-dotted px-4 pt-2 pb-4 gap-4 flex flex-col items-center">
        <h2 className="text-center text-sm text-primary font-bold">
          내 폭탄함
        </h2>
        <div className="flex w-full justify-center flex-wrap gap-x-4 h-full">
          {getFirst ? (
            <>
              {bombs.map((b) => (
                <SendBomb
                  key={b.id}
                  bomb={b}
                  users={room.users}
                  remove={() =>
                    setBombs((bombs) => bombs.filter((bb) => bb.id !== b.id))
                  }
                />
              ))}
              {bombs.length === 0 && (
                <div className="text-primary-bright font-bold flex flex-col items-center justify-center gap-2 h-full">
                  <Loader size={54} />
                  폭탄함이 비었어요!
                </div>
              )}
            </>
          ) : (
            <div className="text-primary w-full h-full items-center justify-center flex">
              <Spinner sz="lg" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

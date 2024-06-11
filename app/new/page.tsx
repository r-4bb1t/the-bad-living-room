"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import RoomRule from "@/components/room/rule";
import Setting from "@/components/room/setting";
import { useUser } from "@/store/useUser";

import { Button, useAlert } from "@r-4bb1t/rabbit-ui";

export default function Home() {
  const now = useMemo(() => {
    let n = new Date();
    n.setMinutes(0);
    n.setSeconds(0);
    n.setMilliseconds(0);
    return n;
  }, []);

  const [startTime, setStartTime] = useState<Date>(
    new Date(now.getTime() + 1000 * 60 * 60),
  );
  const [endTime, setEndTime] = useState<Date>(
    new Date(now.getTime() + 1000 * 60 * 60 * 3),
  );

  const [loading, setLoading] = useState(false);
  const { openModal } = useAlert();

  const { user } = useUser();

  const router = useRouter();

  const handleCreateRoom = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/room`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ownerId: user?.id,
          startTime,
          endTime,
        }),
      });
      const { id: roomId } = await res.json();
      router.push(`/room/${roomId}`);
    } catch (e) {
      openModal({
        children: "방 생성에 실패했습니다. 다시 시도해주세요.",
        submitButtonText: "확인",
        submitButtonAction: () => {},
      });
      setLoading(false);
    }
  }, [user?.id, startTime, endTime, router, openModal]);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center gap-4">
      <div className="text-lg">
        여기는 <span className="text-primary font-bold">{user?.name}</span>님이
        친구들을 초대할 의상한거실...
      </div>
      <Setting
        isEdit={!loading}
        startTime={startTime}
        endTime={endTime}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        loading={loading}
      />
      <RoomRule />
      <Button
        sz={"lg"}
        className="w-full"
        onClick={handleCreateRoom}
        loading={loading}
      >
        방 만들기
      </Button>
    </main>
  );
}

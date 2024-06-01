"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import RoomRule from "@/components/room/rule";
import Setting from "@/components/room/setting";
import { useUser } from "@/store/useUser";

import { Button, useAlert } from "@r-4bb1t/rabbit-ui";

export default function Home() {
  const hour = new Date().getHours();

  const [startHour, setStartHour] = useState(Math.min(hour + 1, 23));
  const [endHour, setEndHour] = useState(Math.min(hour + 6, 24));

  const [loading, setLoading] = useState(false);
  const { openModal } = useAlert();

  const { user } = useUser();

  const router = useRouter();

  const handleCreateRoom = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/room", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ownerId: user?.id,
          startTime: startHour,
          endTime: endHour,
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
    } finally {
      setLoading(false);
    }
  }, [user?.id, startHour, endHour, router, openModal]);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center gap-4">
      <div className="italic text-lg">
        여기는 <span className="text-primary">{user?.name}</span>님이 친구들을
        초대할 의상한거실...
      </div>
      <Setting
        isEdit={true}
        startHour={startHour}
        endHour={endHour}
        setStartHour={setStartHour}
        setEndHour={setEndHour}
        loading={loading}
        date={new Date()}
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

"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

import SignIn from "@/components/signIn";
import { useUser } from "@/store/useUser";

import { Button, useAlert } from "@r-4bb1t/rabbit-ui";

export default function RoomButton({
  userIds,
  roomId,
}: {
  userIds: string[];
  roomId: string;
}) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { openModal } = useAlert();

  const handleEnter = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await fetch(`/api/room/${roomId}/enter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      setTimeout(() => {
        router.refresh();
      }, 1100);
    } catch (e) {
      openModal({
        children: "입장에 실패했습니다. 다시 시도해주세요.",
        submitButtonText: "확인",
        submitButtonAction: () => {},
      });
      setLoading(false);
    }
  }, [openModal, roomId, router, user]);

  return user ? (
    userIds.includes(user.id) ? (
      <div>게임이 시작될 때까지 기다려 주세요.</div>
    ) : (
      <Button onClick={handleEnter} loading={loading}>
        입장하기
      </Button>
    )
  ) : (
    <SignIn roomId={roomId} />
  );
}

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
  const [loading, setLoading] = useState(false);
  const { openModal } = useAlert();

  const handleEnter = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_HOST}/api/room/${roomId}/enter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        },
      );
      window.location.reload();
    } catch (e) {
      openModal({
        children: "입장에 실패했습니다. 다시 시도해주세요.",
        submitButtonText: "확인",
        submitButtonAction: () => {},
      });
    } finally {
      setLoading(false);
    }
  }, [openModal, roomId, user]);

  return user ? (
    userIds.includes(user.id) ? (
      <div className="animate-pulse text-primary text-lg">
        게임이 시작될 때까지 기다려 주세요.
      </div>
    ) : (
      <Button onClick={handleEnter} loading={loading}>
        입장하기
      </Button>
    )
  ) : (
    <SignIn roomId={roomId} />
  );
}

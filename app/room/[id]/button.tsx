"use client";

import SignIn from "@/components/signIn";
import { useUser } from "@/store/useUser";

import { Button } from "@r-4bb1t/rabbit-ui";

export default function RoomButton({
  userIds,
  roomId,
}: {
  userIds: string[];
  roomId: string;
}) {
  const { user } = useUser();

  return user ? (
    userIds.includes(user.id) ? (
      <></>
    ) : (
      <Button>입장하기</Button>
    )
  ) : (
    <SignIn roomId={roomId} />
  );
}

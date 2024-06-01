"use client";

import { useEffect, useMemo, useState } from "react";

import { format } from "date-fns/format";

import Bomb from "@/components/bomb";
import { BOMB_EXPIRE_TIME } from "@/constant";
import { useUser } from "@/store/useUser";
import { BombType } from "@/types/bomb";
import { UserType } from "@/types/user";

import { User } from "@prisma/client";
import { Button, Input, Select, useAlert } from "@r-4bb1t/rabbit-ui";

export default function SendBomb({
  bomb,
  users,
  remove,
}: {
  bomb: BombType;
  users: UserType[];
  remove: () => void;
}) {
  const { openModal } = useAlert();
  const rotate = useMemo(() => (Math.random() - 0.5) * 90, []);
  const [remainingMinute, setRemainingMinute] = useState(
    Math.floor(
      (BOMB_EXPIRE_TIME -
        (new Date().getTime() - new Date(bomb.time).getTime())) /
        1000 /
        60,
    ),
  );
  const [disabled, setDisabled] = useState(
    new Date().getTime() - new Date(bomb.time).getTime() > BOMB_EXPIRE_TIME,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMinute(
        Math.floor(
          (BOMB_EXPIRE_TIME -
            (new Date().getTime() - new Date(bomb.time).getTime())) /
            1000 /
            60,
        ),
      );
      setDisabled(
        new Date().getTime() - new Date(bomb.time).getTime() > BOMB_EXPIRE_TIME,
      );
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [bomb]);

  return (
    <button
      className="relative flex flex-col cursor-pointer items-center"
      onClick={() => {
        openModal({
          children: <Modal bomb={bomb} users={users} remove={remove} />,
          submitButtonText: "닫기",
          submitButtonAction: () => {},
        });
      }}
    >
      <Bomb
        src={users.find((u) => u.id === bomb.originalUserId)?.photo}
        rotate={rotate}
        disabled={disabled}
      />
      {disabled ? (
        <div className="text-sm text-primary-bright font-bold">귀속됨</div>
      ) : (
        <div className="text-sm text-primary font-bold">
          {remainingMinute}분 남음
        </div>
      )}
    </button>
  );
}

const Modal = ({
  bomb,
  users,
  remove,
}: {
  bomb: BombType;
  users: UserType[];
  remove: () => void;
}) => {
  const { user } = useUser();
  const [receiver, setReceiver] = useState<User>(
    users.filter((u) => u.id !== user?.id)[0],
  );
  const [text, setText] = useState<string>("");
  const { closeModal, addToast } = useAlert();
  const [loading, setLoading] = useState(false);

  const sendBomb = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/bomb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: user.id,
          receiver: receiver.id,
          bomb: bomb.id,
          text,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      addToast({
        type: "success",
        text: "폭탄을 성공적으로 보냈어요!",
      });
      remove();
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "Bomb is expired") {
          addToast({
            type: "error",
            text: "그새 폭탄이 귀속되었어요. 민첩한 하루 보내세요.",
          });
        }
      }
    } finally {
      closeModal();
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      {user?.id === bomb.senderId ? (
        <div>내 우편함에 도착한 폭탄이에요.</div>
      ) : (
        <>
          <div>
            <span className="font-bold text-primary">
              {users.find((u) => u.id === bomb.senderId)?.name}
            </span>
            님이 보낸 폭탄이에요.
          </div>
          <div className="border border-primary border-dotted rounded py-1 px-2 text-center w-full text-sm">
            {bomb.text[bomb.text.length - 1]}
          </div>
        </>
      )}
      <Bomb
        src={users.find((u) => u.id === bomb.originalUserId)?.photo}
        disabled={
          new Date().getTime() - new Date(bomb.time).getTime() >
          BOMB_EXPIRE_TIME
        }
      />
      <div className="text-sm">
        {format(new Date(bomb.time), "hh시 mm분 ss초에 도착함")}
      </div>
      {new Date().getTime() - new Date(bomb.time).getTime() <
      BOMB_EXPIRE_TIME ? (
        <div className="flex flex-col w-full gap-1">
          <Select
            options={users
              .filter((u) => u.id !== user?.id)
              .map((u) => ({
                label: u.name,
                value: u.id,
              }))}
            value={receiver.id}
            onChange={(value) =>
              setReceiver(users.find((u) => u.id === value) as User)
            }
            sz="sm"
            label="받는 사람"
          />
          <Input
            label="메시지"
            value={text}
            onChange={(e) => setText(e.target.value)}
            sz="sm"
            placeholder="바보"
          />
          <Button onClick={sendBomb} loading={loading}>
            폭탄 보내기
          </Button>
        </div>
      ) : (
        <div className="text-center">
          아쉽지만 <span className="text-primary font-bold">{user?.name}</span>
          님에게 귀속되었어요!
          <br />
          민첩한 하루 보내세요.
        </div>
      )}
    </div>
  );
};

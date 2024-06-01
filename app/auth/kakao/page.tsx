"use client";

import React, { useCallback, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useUser } from "@/store/useUser";

import { Button, Input, useAlert } from "@r-4bb1t/rabbit-ui";

export default function Kakao() {
  const code = useSearchParams().get("code");
  const state = useSearchParams().get("state");

  const { user, setUser } = useUser();
  const { openModal } = useAlert();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [authFlag, setAuthFlag] = useState(false);

  const handleAuthCode = useCallback(async (code: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const { user, isNew } = await res.json();
      if (isNew) {
        setUser(user);
        setName(user.name);
      } else {
        setUser(user);
        router.push(state ? `/room/${state}` : "/new");
      }
    } catch (e) {
      openModal({
        children: "로그인에 실패했습니다. 다시 시도해주세요.",
        submitButtonText: "확인",
        submitButtonAction: () => router.push("/"),
      });
    }
  }, []);

  const handleUpdateName = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await fetch("/api/auth", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id, name }),
      });
      setUser({ ...user, name: name! });
      router.push(state ? `/room/${state}` : "/new");
    } catch (e) {
      openModal({
        children: "이름 수정에 실패했습니다. 다시 시도해주세요.",
        submitButtonText: "확인",
        submitButtonAction: () => {},
      });
      setLoading(false);
    }
  }, [name, openModal, router, setUser, state, user]);

  useEffect(() => {
    if (code && !authFlag) {
      handleAuthCode(code);
      setAuthFlag(true);
    }
  }, [code, handleAuthCode, authFlag]);

  return name === null ? (
    <></>
  ) : (
    <div className="w-full px-8 h-screen pt-16 flex items-center justify-center flex-col gap-2">
      <h1 className="text-lg font-bold text-primary">가입이 완료되었어요.</h1>
      <div>이름을 수정하고 싶으신가요?</div>
      <Input
        label="이름"
        defaultValue={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
        error={[
          {
            err: "이름은 비워둘 수 없습니다.",
            ok: "이름이 입력되었습니다.",
            status: name.length > 0,
          },
        ]}
      />
      <div className="w-full grid grid-cols-2 gap-2 mt-2">
        <Button
          onClick={handleUpdateName}
          className="w-full shrink"
          loading={loading}
        >
          수정
        </Button>
        <Button
          onClick={() => router.push("/new")}
          ghost
          className="w-full shrink"
          disabled={loading}
        >
          취소
        </Button>
      </div>
    </div>
  );
}

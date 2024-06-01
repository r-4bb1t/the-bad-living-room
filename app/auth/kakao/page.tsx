"use client";

import { useCallback, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useUser } from "@/store/useUser";

import { useAlert } from "@r-4bb1t/rabbit-ui";

export default function Kakao() {
  const code = useSearchParams().get("code");
  const state = useSearchParams().get("state");
  const { setUser } = useUser();
  const { openModal } = useAlert();
  const router = useRouter();

  const handleAuthCode = useCallback(async (code: string) => {
    console.log("ASDF");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const { user } = await res.json();
      setUser(user);
      router.push(state ? `/room/${state}` : "/new");
    } catch (e) {
      openModal({
        children: "로그인에 실패했습니다. 다시 시도해주세요.",
        submitButtonText: "확인",
        submitButtonAction: () => router.push("/"),
      });
    }
  }, []);

  useEffect(() => {
    console.log(code);
    if (code) handleAuthCode(code);
  }, [code]);

  return <></>;
}

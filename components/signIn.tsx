"use client";

import { useState } from "react";

import cc from "classcat";
import Image from "next/image";

import { Button } from "@r-4bb1t/rabbit-ui";

export default function SignIn({ roomId }: { roomId?: string }) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const url =
      "https://kauth.kakao.com/oauth/authorize?client_id=" +
      process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID +
      "&redirect_uri=" +
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL +
      "&response_type=code&" +
      "scope=profile_nickname profile_image" +
      "&state=" +
      (roomId ?? "");

    window.open(url, "_self");
  };

  return (
    <Button
      sz={"lg"}
      className="w-full !bg-[#FEE500] disabled:!bg-[#f1e466] [&:not(:disabled)]:hover:!bg-[#fecf00] !text-[rgba(0,0,0,0.85)] disabled:!text-[rgba(0,0,0,0)] gap-2"
      onClick={() => {
        setLoading(true);
        handleSignIn();
      }}
      loading={loading}
    >
      <div className={cc(["relative w-5 h-5", loading && "opacity-0"])}>
        <Image
          src="/assets/kakao.svg"
          fill
          alt="kakao logo"
          className="object-contain"
        />
      </div>
      카카오 로그인
    </Button>
  );
}

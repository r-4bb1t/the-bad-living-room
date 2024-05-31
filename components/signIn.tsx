"use client";

import { useState } from "react";

import cc from "classcat";
import { signIn } from "next-auth/react";
import Image from "next/image";

import { Button } from "@r-4bb1t/rabbit-ui";

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      sz={"lg"}
      className="w-full disabled:!text-opacity-0 !bg-[#FEE500] [&:not(:disabled)]:hover:!bg-[#fecf00] !text-[rgba(0,0,0,0.85)] gap-2"
      onClick={() => {
        setLoading(true);
        signIn("kakao");
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

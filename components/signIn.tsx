"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

import { Button } from "@r-4bb1t/rabbit-ui";

export default function SignIn() {
  return (
    <Button
      sz={"lg"}
      className="w-full !bg-[#FEE500] hover:!bg-[#fecf00] !text-[rgba(0,0,0,0.85)] gap-2"
      onClick={() => signIn("kakao")}
    >
      <div className="relative w-5 h-5">
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

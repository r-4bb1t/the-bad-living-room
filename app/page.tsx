"use client";

import Image from "next/image";

import Bomb from "@/components/bomb";

import { Button } from "@r-4bb1t/rabbit-ui";

export default function Home() {
  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center justify-between gap-4">
      <div className="italic text-lg">여기는 의상한거실...</div>
      <div className="w-full h-full flex items-center justify-center flex-col">
        <Bomb src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnTWnYnu8TJHZf6AAVqY-y9kX6rkg9hsVpOQ&s" />
      </div>
      <Button
        sz={"lg"}
        className="w-full !bg-[#FEE500] hover:!bg-[#fecf00] !text-[rgba(0,0,0,0.85)] gap-2"
      >
        <div className="relative w-5 h-5">
          <Image
            src="/assets/kakao.svg"
            layout="fill"
            alt="kakao logo"
            className="object-contain"
          />
        </div>
        카카오 로그인
      </Button>
    </main>
  );
}

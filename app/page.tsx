"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import Bomb from "@/components/bomb";
import SignIn from "@/components/signIn";
import { useUser } from "@/store/useUser";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/new");
    }
  }, [router, user]);

  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center justify-between gap-4">
      <div className="text-lg">여기는 의상한거실...</div>
      <div className="w-full h-full flex items-center justify-center flex-col">
        <Bomb />
      </div>
      <SignIn />
    </main>
  );
}

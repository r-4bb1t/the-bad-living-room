import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]";
import Bomb from "@/components/bomb";
import SignIn from "@/components/signIn";

const checkCredentials = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/new");
  }

  return session;
};

export default async function Home() {
  await checkCredentials();

  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center justify-between gap-4">
      <div className="italic text-lg">여기는 의상한거실...</div>
      <div className="w-full h-full flex items-center justify-center flex-col">
        <Bomb />
      </div>
      <SignIn />
    </main>
  );
}

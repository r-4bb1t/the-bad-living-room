"use client";

import { Button } from "@r-4bb1t/rabbit-ui";

export default function Home() {
  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center justify-between">
      <div className="italic text-lg">
        여기는 <span className="text-primary-background">노넥</span>이 초대한
        의상한거실...
      </div>
      <div className="p-4 rounded border border-primary-background border-dotted">
        <h2 className="font-bold text-primary-background mb-1">Notice</h2>
        <ul className="list-disc px-4 marker:text-primary-background leading-7">
          <li>
            게임은 <span className="text-primary-background"></span>
            부터 시작됩니다.
          </li>
          <li>
            게임 종료 시간은{" "}
            <span className="text-primary-background">
              오후 5시 30분에서 6시 사이
            </span>
            에 <span className="text-primary-background">무작위</span>로
            결정됩니다.
          </li>
        </ul>
      </div>
      <div className="p-4 rounded border border-primary-background border-dotted">
        <h2 className="font-bold text-primary-background mb-1">Rule</h2>
        <ol className="list-decimal px-4 marker:text-primary-background leading-7">
          <li>1시간마다 각자의 우편함에 쓰레기가 들어옵니다.</li>
          <li>
            우편함에 들어온것은{" "}
            <span className="text-primary-background">우편함 확인하기</span>를
            해야만 우편함에서 인벤토리로 넘어오며 확인이 가능합니다.
            <div className="text-sm font-light">
              <span className="text-primary-background">*</span> 우편함
              확인하기는 15분마다 가능합니다.
            </div>
          </li>
          <li>우편함에 들어온 지 30분이 지난 쓰레기는 귀속됩니다.</li>
          <li>
            아직 귀속되지 않은 인벤토리에 있는 쓰레기는 자유롭게 전달이
            가능합니다.
          </li>
          <li>
            게임이 무작위로 종료되었을 때{" "}
            <span className="text-primary-background">
              가장 많은 쓰레기를 보유한 사람
            </span>
            이 패배합니다.
          </li>
        </ol>
      </div>
      <Button sz={"lg"} className="w-full">
        방 만들기
      </Button>
    </main>
  );
}

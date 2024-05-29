"use client";

import { useState } from "react";

import { Button, List, Select } from "@r-4bb1t/rabbit-ui";

export default function Home() {
  const hour = new Date().getHours();

  const [startTime, setStartTime] = useState(hour);
  const [endTime, setEndTime] = useState(Math.min(hour + 6, 23));

  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center justify-between gap-4">
      <div className="italic text-lg">여기는 의상한거실...</div>
      <div className="p-4 rounded border border-primary border-dotted">
        <h2 className="font-bold text-primary mb-1">Setting</h2>
        <ul className="list-disc px-4 marker:text-primary leading-7">
          <li>
            게임은{" "}
            <Select
              sz={"xs"}
              options={new Array(24).fill(0).map((_, i) => ({
                value: i,
                label: `${i}시`,
              }))}
              onChange={setStartTime}
              value={startTime}
              className="w-22 mr-2 text-primary"
            />
            부터 시작됩니다.
          </li>
          <li>
            게임 종료 시간은{" "}
            <span className="text-primary">
              <Select
                sz={"xs"}
                options={new Array(24).fill(0).map((_, i) => ({
                  value: i,
                  label: `${i}시`,
                }))}
                onChange={setEndTime}
                value={endTime}
                className="w-22 mr-2"
              />
              에서 {endTime}시 30분 사이
            </span>
            에 <span className="text-primary">무작위</span>로 결정됩니다.
          </li>
        </ul>
      </div>
      <div className="p-4 rounded border border-primary border-dotted">
        <h2 className="font-bold text-primary mb-1">Rule</h2>
        <List
          type="decimal"
          className="list-decimal px-4 marker:text-primary leading-7"
        >
          <li>1시간마다 각자의 우편함에 쓰레기가 들어옵니다.</li>
          <li>
            우편함에 들어온것은{" "}
            <span className="text-primary">우편함 확인하기</span>를 해야만
            우편함에서 인벤토리로 넘어오며 확인이 가능합니다.
            <div className="text-sm font-light">
              <span className="text-primary">*</span> 우편함 확인하기는 15분마다
              가능합니다.
            </div>
          </li>
          <li>우편함에 들어온 지 30분이 지난 쓰레기는 귀속됩니다.</li>
          <li>
            아직 귀속되지 않은 인벤토리에 있는 쓰레기는 자유롭게 전달이
            가능합니다.
          </li>
          <li>
            게임이 무작위로 종료되었을 때{" "}
            <span className="text-primary">가장 많은 쓰레기를 보유한 사람</span>
            이 패배합니다.
          </li>
        </List>
      </div>
      <Button sz={"lg"} className="w-full">
        방 만들기
      </Button>
    </main>
  );
}

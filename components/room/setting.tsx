"use client";

import { format } from "date-fns/format";

import { RANDOM_ADD_TIME } from "@/constant";

import { Input, List } from "@r-4bb1t/rabbit-ui";

export default function Setting({
  isEdit,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  loading,
}: {
  loading?: boolean;
  isEdit: boolean;

  startTime: Date;
  endTime: Date;
  setStartTime?: React.Dispatch<React.SetStateAction<Date>>;
  setEndTime?: React.Dispatch<React.SetStateAction<Date>>;
}) {
  return (
    <div className="p-4 rounded border border-primary border-dotted">
      <h2 className="font-bold text-primary mb-1">
        {isEdit ? "Setting" : "Notice"}
      </h2>
      <List marker="disc" className="px-4 leading-7">
        <li>
          게임은{" "}
          <span className="text-primary font-bold">
            {isEdit ? (
              <Input
                type="datetime-local"
                fullWidth={false}
                disabled={loading}
                sz={"xs"}
                onChange={(e) => {
                  console.log(e.target.value);
                  setStartTime!(new Date(e.target.value));
                }}
                value={
                  format(startTime, "yyyy-MM-dd") +
                  "T" +
                  format(startTime, "hh:mm")
                }
                className="mr-2 text-primary"
              />
            ) : (
              <>
                {format(startTime, "M월 d일 HH시")}
                {startTime.getMinutes() === 0
                  ? ""
                  : " " + startTime.getMinutes() + "분"}{" "}
              </>
            )}
          </span>
          부터 시작됩니다.
        </li>
        <li>
          게임 종료 시간은{" "}
          <span className="text-primary font-bold">
            {isEdit ? (
              <Input
                type="datetime-local"
                fullWidth={false}
                disabled={loading}
                sz={"xs"}
                onChange={(e) => setEndTime!(new Date(e.target.value))}
                value={
                  format(endTime, "yyyy-MM-dd") + "T" + format(endTime, "hh:mm")
                }
                className="mr-2 text-primary"
              />
            ) : (
              <>
                {endTime.getDate() === startTime.getDate()
                  ? ""
                  : format(endTime, "M월 d일 ")}
                {format(endTime, "HH시")}
                {endTime.getMinutes() === 0
                  ? ""
                  : " " + endTime.getMinutes() + "분"}
              </>
            )}
            에서{" "}
            {endTime.getDate() ===
            new Date(endTime.getTime() + RANDOM_ADD_TIME).getDate()
              ? ""
              : format(
                  new Date(endTime.getTime() + RANDOM_ADD_TIME),
                  "M월 d일 ",
                )}
            {format(new Date(endTime.getTime() + RANDOM_ADD_TIME), "HH시")}
            {new Date(endTime.getTime() + RANDOM_ADD_TIME).getMinutes() === 0
              ? ""
              : " " +
                new Date(endTime.getTime() + RANDOM_ADD_TIME).getMinutes() +
                "분"}{" "}
            사이
          </span>
          에 <span className="text-primary font-bold">무작위</span>로
          결정됩니다.
        </li>
      </List>
    </div>
  );
}

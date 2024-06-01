import { format } from "date-fns/format";

import { List, Select } from "@r-4bb1t/rabbit-ui";

export default function Setting({
  isEdit,
  startHour: startTime,
  endHour: endTime,
  setStartHour: setStartTime,
  setEndHour: setEndTime,
  loading,
  date,
}: {
  loading?: boolean;
  isEdit: boolean;

  startHour: number;
  endHour: number;
  setStartHour?: React.Dispatch<React.SetStateAction<number>>;
  setEndHour?: React.Dispatch<React.SetStateAction<number>>;

  date: Date;
}) {
  return (
    <div className="p-4 rounded border border-primary border-dotted">
      <h2 className="font-bold text-primary mb-1">
        {isEdit ? "Setting" : "Notice"}
      </h2>
      <List marker="disc" className="px-4 marker:text-primary">
        <li>
          게임은 {format(date, "yyyy년 MM월 dd일")} 바로 오늘,{" "}
          <span className="text-primary">
            {isEdit ? (
              <Select
                fullWidth={false}
                disabled={loading}
                sz={"xs"}
                options={new Array(24).fill(0).map((_, i) => ({
                  value: i,
                  label: `${i}시`,
                }))}
                onChange={setStartTime}
                value={startTime}
                className="w-22 mr-2 text-primary"
              />
            ) : (
              `${startTime}시`
            )}
          </span>
          부터 시작됩니다.
        </li>
        <li>
          게임 종료 시간은{" "}
          <span className="text-primary">
            {isEdit ? (
              <Select
                fullWidth={false}
                disabled={loading}
                sz={"xs"}
                options={new Array(24).fill(0).map((_, i) => ({
                  value: i + 1,
                  label: `${i + 1}시`,
                }))}
                onChange={setEndTime}
                value={endTime}
                className="w-22 mr-2"
              />
            ) : (
              `${endTime}시`
            )}
            에서 {endTime}시 30분 사이
          </span>
          에 <span className="text-primary">무작위</span>로 결정됩니다.
        </li>
      </List>
    </div>
  );
}

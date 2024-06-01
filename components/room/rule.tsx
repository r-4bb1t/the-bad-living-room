import { BOMB_EXPIRE_TIME, POSTBOX_COOLTIME } from "@/constant";

import { List } from "@r-4bb1t/rabbit-ui";

export default function RoomRule() {
  return (
    <div className="p-4 rounded border border-primary border-dotted">
      <h2 className="font-bold text-primary mb-1">Rule</h2>
      <List marker="decimal" className="px-4 leading-7">
        <li>1시간마다 각자의 우편함에 폭탄이 들어옵니다.</li>
        <li>
          우편함에 들어온것은{" "}
          <span className="text-primary font-bold">우편함 확인하기</span>를
          해야만 우편함에서 폭탄함으로 넘어오며 확인이 가능합니다.
          <div className="text-sm font-light mb-1">
            <span className="text-primary font-bold">*</span> 우편함 확인하기는{" "}
            {POSTBOX_COOLTIME / 1000 / 60}분마다 가능합니다.
          </div>
        </li>
        <li>
          우편함에 들어온 지 {BOMB_EXPIRE_TIME / 1000 / 60}분이 지난 폭탄은
          귀속됩니다.
        </li>
        <li>
          아직 귀속되지 않은 폭탄함에 있는 폭탄은 자유롭게 전달이 가능합니다.
        </li>
        <li>
          게임이 무작위로 종료되었을 때{" "}
          <span className="text-primary font-bold">
            가장 많은 폭탄을 보유한 사람
          </span>
          이 패배합니다.
        </li>
      </List>
    </div>
  );
}

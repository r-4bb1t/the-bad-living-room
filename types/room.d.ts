import { UserType } from "./user";

export interface RoomType {
  id: string;
  ownerName: string;
  startTime: string;
  endTime: string;
  users: UserType[];
  status: "waiting" | "playing" | "end";
  end?: EndType;
}

export interface EndType {
  bombs: {
    originalUserId: string;
    via: string[];
    text: string[];
    ownerId: string;
  }[];
  awards: AwardType[];
}

export interface AwardType {
  title: string;
  description: string;
  userId: string;
}

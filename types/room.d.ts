import { UserType } from "./user";

export interface RoomType {
  id: string;
  ownerName: string;
  startTime: string;
  endTime: string;
  users: UserType[];
}

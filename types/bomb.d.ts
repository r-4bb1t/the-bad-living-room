export interface BombType {
  id: string;
  originalUserId: string;
  senderId: string;
  opened: boolean;
  time: string;
  text: string[];
}

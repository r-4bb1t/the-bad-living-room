import { create } from "zustand";

import { UserType } from "@/types/user";

interface UserState {
  user: UserType | null;
}

export const useUser = create<UserState>((set) => ({
  user: null,
}));

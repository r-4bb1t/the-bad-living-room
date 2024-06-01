import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { UserType } from "@/types/user";

interface UserStoreType {
  user: UserType | null;
  setUser: (user: UserType) => void;
}

export const useUser = create(
  persist<UserStoreType>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthMemberActionsStore } from "./@types";

// Custom storage wrapper for localStorage
const localStorageWrapper = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useAuthMemberStore = create<AuthMemberActionsStore>()(
  devtools(
    persist(
      (set) => ({
        me: null,
        setMe: (me) => {
          console.log("Setting me:", me);
          set({ me });
        },
      }),
      {
        name: "AuthMemberStore", // Key for the storage
        storage: localStorageWrapper, // Use custom storage wrapper
      }
    ),
    { name: "AuthMemberStore", enabled: true }
  )
);

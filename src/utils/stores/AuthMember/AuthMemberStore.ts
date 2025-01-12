import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthMember } from "./@types";


interface AuthMemberActionsStore {
  me: AuthMember | null;
  isLoading: boolean;
  setMe: (me: AuthMember | null) => void;
  setLoading: (loading: boolean) => void;
}

const localStorageWrapper = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(name, JSON.stringify(value));
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(name);
    }
  },
};

export const useAuthMemberStore = create<AuthMemberActionsStore>()(
  devtools(
    persist(
      (set) => ({
        me: null,
        isLoading: false,
        setMe: (me) => set({ me }),
        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: "AuthMemberStore",
        storage: localStorageWrapper,
      }
    ),
    { name: "AuthMemberStore", enabled: true }
  )
);

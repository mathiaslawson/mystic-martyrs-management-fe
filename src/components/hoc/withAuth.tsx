"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { getAccountDataAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";


export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function WithAuth(props: T) {
    const router = useRouter();
    const { me, setMe } = useAuthMemberStore();

    const {
      execute: getAccountData,
      status,
      result: accountData,
    } = useAction(getAccountDataAction);

    useEffect(() => {
      const checkAuth = async () => {
        if (!me) {
          getAccountData();
        }
      };

      checkAuth();
    }, [getAccountData, me]);

    useEffect(() => {
      if (accountData) {
        if (accountData.serverError) {
          toast.warning("Session Expired, Please Login Again!");
          router.replace("/auth");
        } else if (accountData.data) {
          setMe(accountData.data);
        }
      }
    }, [accountData, router, setMe]);

    // Show loading state when checking authentication
    if (status === "executing" || (!me && !accountData)) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900">
          <span className="loader-book" />
          <h1 className="text-center font-bold text-3xl mt-4 text-gray-800 dark:text-white">
            Mystic-Martyrs-Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Verifying your session...
          </p>
        </div>
      );
    }

    if (accountData?.serverError) {
      return null; // We'll redirect in the useEffect
    }

    return me ? <WrappedComponent {...props} /> : null;
  };
}
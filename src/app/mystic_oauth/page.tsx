'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setServerSideCookie } from "@/lib/get-cookie";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getAccountDataAction } from "@/app/actions/auth";
import { useUser } from "@/app/context/UserContext";
import { useAction } from "next-safe-action/hooks";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";


const REDIRECT_DELAY = 4000;

const RedirectPage = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading] = useState(true);

  const getTokenFromUrl = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("token");
    }
    return null;
  };


  const { execute: getAccountData, result: accountData, status: accountDataLoading } = useAction(getAccountDataAction)
  const { setMe} = useAuthMemberStore()

  useEffect(() => {
    const token = getTokenFromUrl();

    if (token) {
      setServerSideCookie("access_token", token);
    }

    getAccountData()
    setTimeout(() => {
        if(accountDataLoading === "hasSucceeded"){
          setMe(accountData.data)
          router.push("/home");
        }
    }, REDIRECT_DELAY);
   
  }, [setUser, router, getAccountData, accountDataLoading, accountData.data, setMe]);

  if (isLoading) {
    return (
      <main className="bg-white h-screen flex flex-col justify-center items-center">
        <DotLottieReact
          src="https://lottie.host/5e27da3a-bc98-4cf1-9d1e-05cc7d03aac7/Op3zqIOynr.lottie"
          style={{ width: 450, height: 450 }}
          loop
          autoplay
        />
        <h1 className="text-xl font-bold text-gray-800 text-center mt-4">
          Awesome! You have successfully logged in to Mystic-Martyrs-Management System
        </h1>
        <span className="text-gray-500 text-sm text-center mt-2">
          You will be redirected to the dashboard shortly.
        </span>
      </main>
    );
  }

  return null;
};

export default RedirectPage;

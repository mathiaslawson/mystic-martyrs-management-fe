'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setCookie, getCookie } from "@/lib/get-cookie";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getAccountDataAction } from "@/app/actions/auth";
import { useUser } from "@/app/context/UserContext";

// const REDIRECT_DELAY = 4000;

const RedirectPage = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const getTokenFromUrl = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("token");
    }
    return null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getAccountDataAction();
        // if (userData && typeof userData === "object" && "email" in userData) {
        //   setUser({ email: (userData as { email: string }).email });
        // } else {
        //   throw new Error("Invalid user data received.");
        // }
        console.log(userData);
      } catch (error) {
        console.log(error)
        toast.error(error instanceof Error ? error.message : "Failed to fetch user data.");
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    const token = getTokenFromUrl();
    if (token) {
      setCookie("access_token", token);
      console.log(token)
    }

    const storedToken = getCookie("access_token");
    if (storedToken) {
      console.log(token);
      fetchUserData();
      // setTimeout(() => {
      //   router.push("/home");
      // }, REDIRECT_DELAY);
    } else {
      // router.push("/auth");
      console.log("No toke  found")
    }
  }, [setUser, router]);

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

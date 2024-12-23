"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Importing useRouter

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initializing the useRouter hook

  const handleLogin = () => {
    setIsLoading(true);
    try {
      // Redirecting to the OAuth authentication endpoint
      window.location.href = "https://mystic-be.vercel.app/api/v1/auth/invite/04027a3d-ba5e-4c40-91e5-58f651cedc5d";
    } catch (error) {
      toast.error("Failed to redirect for login. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full flex flex-col justify-center items-start gap-2">
        <div className="p-8">
          <h2 className="text-3xl font-bold">Shalom Martyr,</h2>
          <p>You are welcome back</p>
          <div className="w-full">
            <Button
              className="bg-purple-600 hover:bg-purple-800 text-white md:w-96 text-center px-10 py-4 my-3"
              onClick={handleLogin}
              // disabled={!isLoading}
            >
              {isLoading ?(
                 <span className="loader"></span>
              ): "Log In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

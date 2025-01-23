"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


export default function AuthPage() {
 
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async () => {
    setIsLoading(true);
  try {
    //Redirect to OAuth authentication endpoint
    window.location.href="https://mystic-be.vercel.app//api/v1/auth/invite";
  } catch (error) {
    
  console.error("Login error:",error);
    toast.error("Failed to redirect for login. Please try again")
}
finally{
  setIsLoading(false)
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
              disabled={isLoading}
            >
              {isLoading ? <span className="loader"></span> : "Log In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
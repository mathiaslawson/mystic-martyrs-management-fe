"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleLogin = async () => {
  
    window.location.href = `https://mystic-be.vercel.app/v1/auth/invite/04027a3d-ba5e-4c40-91e5-58f651cedc5d`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
        <div className="p-8">
          <p className="flex justify-center">Hey there Mystic</p>
          <form>
            <div className="mt-8 mb-5">
              <Button 
                type="button"
                onClick={handleGoogleLogin}
              >
                Startup With Google
              </Button>
            </div>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Need an account?" : "Already have an account?"}
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setIsLogin(!isLogin);
            }}
            className="text-sm"
          >
            Sheesh
          </Button>
        </div>
      </div>
    </div>
  );
}
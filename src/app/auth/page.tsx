"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Eye, EyeOff, UserPlus, LogIn, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fireOAuth, loginUserAction, signUpUserAction, url } from "../actions/auth";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
        <div className="p-8">
          <p className="flex justify-center"> Hey there Mystic</p>

          <form>
            <div className="mt-8 mb-5">
              {/* <a href={`${url}api/v1/auth/invite/04027a3d-ba5e-4c40-91e5-58f651cedc5d`}>
              <Button className="bg-purple-700 text-white w-full" type='button' >
                Continue with Google
              </Button>
              </a> */}
              
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

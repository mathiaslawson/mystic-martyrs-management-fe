"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { Eye, EyeOff, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { loginUserAction, signUpUserAction } from "../actions/auth"
import { useAction } from 'next-safe-action/hooks'

const roles = [
  { id: "user", label: "User" },
  { id: "manager", label: "Manager" },
  { id: "admin", label: "Admin" },
]

type LoginInputs = {
  email: string
  password: string
}

type SignUpInputs = {
  name: string
  email: string
  password: string
  role: string
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const { 
    register: registerLogin, 
    handleSubmit: handleSubmitLogin, 
    formState: { errors: loginErrors } 
  } = useForm<LoginInputs>()

  const { 
    register: registerSignUp, 
    handleSubmit: handleSubmitSignUp, 
    formState: { errors: signUpErrors } 
  } = useForm<SignUpInputs>()

  const { execute: executeLogin, result: loginResult, isExecuting: isLoginExecuting } = useAction(loginUserAction)
  const { execute: executeSignUp, result: signUpResult, isExecuting: isSignUpExecuting } = useAction(signUpUserAction)

  const onLoginSubmit: SubmitHandler<LoginInputs> = (data) => {
    console.log("Login form submitted", data)
    executeLogin(data)
    router.push("/") 
  }

  const onSignUpSubmit: SubmitHandler<SignUpInputs> = (data) => {
    console.log("Sign up form submitted", data)
    executeSignUp(data)
    // router.push("/") 
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          {isLogin ? (
            <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">Email</Label>
                <Input 
                  id="loginEmail" 
                  type="email" 
                  placeholder="john@example.com" 
                  {...registerLogin("email", { required: "Email is required" })} 
                />
                {loginErrors.email && <span className="text-red-500 text-sm">{loginErrors.email.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerLogin("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {loginErrors.password && <span className="text-red-500 text-sm">{loginErrors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full bg-purple-900" disabled={isLoginExecuting}>
                {isLoginExecuting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitSignUp(onSignUpSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signUpName">Full Name</Label>
                <Input 
                  id="signUpName" 
                  placeholder="John Doe" 
                  {...registerSignUp("name", { required: "Name is required" })} 
                />
                {signUpErrors.name && <span className="text-red-500 text-sm">{signUpErrors.name.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signUpEmail">Email</Label>
                <Input 
                  id="signUpEmail" 
                  type="email" 
                  placeholder="john@example.com" 
                  {...registerSignUp("email", { required: "Email is required" })} 
                />
                {signUpErrors.email && <span className="text-red-500 text-sm">{signUpErrors.email.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signUpPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="signUpPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerSignUp("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signUpErrors.password && <span className="text-red-500 text-sm">{signUpErrors.password.message}</span>}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <RadioGroup defaultValue="user" className="flex space-x-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={role.id} 
                        id={role.id} 
                        {...registerSignUp("role", { required: "Role is required" })} 
                      />
                      <Label htmlFor={role.id}>{role.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {signUpErrors.role && <span className="text-red-500 text-sm">{signUpErrors.role.message}</span>}
              </div>
              <Button type="submit" className="w-full bg-purple-900" disabled={isSignUpExecuting}>
                {isSignUpExecuting ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          )}
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Need an account?" : "Already have an account?"}
          </p>
          <Button
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm"
          >
            {isLogin ? (
              <UserPlus className="mr-2 h-4 w-4" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            {isLogin ? "Sign Up" : "Log In"}
          </Button>
        </div>
      </div>
    </div>
  )
}
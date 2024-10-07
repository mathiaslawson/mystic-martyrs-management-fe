"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { Eye, EyeOff, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { loginUserAction, signUpUserAction } from "../actions/auth"
import { useAction } from 'next-safe-action/hooks'
import { toast } from "sonner"

enum UserRole {
  MEMBER = "MEMBER",
  FELLOWSHIP_LEADER = "FELLOWSHIP_LEADER",
  ZONE_LEADER = "ZONE_LEADER",
  CELL_LEADER = "CELL_LEADER",
  ADMIN = "ADMIN"
}

const roles = [
  { id: UserRole.MEMBER, label: "Member" },
  { id: UserRole.FELLOWSHIP_LEADER, label: "Fellowship Leader" },
  { id: UserRole.ZONE_LEADER, label: "Zone Leader" },
  { id: UserRole.CELL_LEADER, label: "Cell Leader" },
  { id: UserRole.ADMIN, label: "Admin" },
]

type LoginInputs = {
  email: string
  password: string
}

type SignUpInputs = {
  firstname: string
  lastname: string
  email: string
  password: string
  role: UserRole
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
  const { execute: executeSignUp, isExecuting: isSignUpExecuting } = useAction(signUpUserAction)

  const onLoginSubmit: SubmitHandler<LoginInputs> = (data) => {
    console.log("Login form submitted", data)
    executeLogin(data)
  }

  const onSignUpSubmit: SubmitHandler<SignUpInputs> = (data) => {
    console.log("Sign up form submitted", data)
    executeSignUp(data)
  }

  const handleSuccessfulAuth = useCallback((message: string) => {
    toast.success(message)
    // Use setTimeout to delay the navigation
    setTimeout(() => {
      router.push("/home")
    }, 100)
  }, [router])

  useEffect(() => {
    if (loginResult?.data?.success === true) {
      handleSuccessfulAuth("Login successful!")
    } else if (loginResult?.data?.success === undefined) {
      toast.error("Login failed")
    }
  }, [loginResult, handleSuccessfulAuth])

  // useEffect(() => {
  //   if (signUpResult?.data?.success === true) {
  //     handleSuccessfulAuth("Sign up successful!")
  //   } else if (signUpResult?.data?.success === false) {
  //     toast.error(signUpResult.data.message || "Sign up failed")
  //   }
  // }, [signUpResult, handleSuccessfulAuth])

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
                  disabled={isLoginExecuting ? true : undefined}
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
                    disabled={isLoginExecuting}
                    
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700"
                    disabled={isLoginExecuting}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {loginErrors.password && <span className="text-red-500 text-sm">{loginErrors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full bg-purple-900" disabled={isLoginExecuting}>
                {isLoginExecuting ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitSignUp(onSignUpSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signUpFirstName">First Name</Label>
                <Input 
                  id="signUpFirstName" 
                  placeholder="John" 
                  {...registerSignUp("firstname", { required: "First name is required" })} 
                  disabled={isSignUpExecuting}
                />
                {signUpErrors.firstname && <span className="text-red-500 text-sm">{signUpErrors.firstname.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signUpLastName">Last Name</Label>
                <Input 
                  id="signUpLastName" 
                  placeholder="Doe" 
                  {...registerSignUp("lastname", { required: "Last name is required" })} 
                  disabled={isSignUpExecuting}
                />
                {signUpErrors.lastname && <span className="text-red-500 text-sm">{signUpErrors.lastname.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signUpEmail">Email</Label>
                <Input 
                  id="signUpEmail" 
                  type="email" 
                  placeholder="john@example.com" 
                  {...registerSignUp("email", { required: "Email is required" })} 
                  disabled={isSignUpExecuting}
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
                    disabled={isSignUpExecuting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700"
                    disabled={isSignUpExecuting}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signUpErrors.password && <span className="text-red-500 text-sm">{signUpErrors.password.message}</span>}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <RadioGroup defaultValue={UserRole.MEMBER} className="flex flex-wrap gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={role.id} 
                        id={role.id} 
                        {...registerSignUp("role", { required: "Role is required" })} 
                        disabled={isSignUpExecuting}
                      />
                      <Label htmlFor={role.id}>{role.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {signUpErrors.role && <span className="text-red-500 text-sm">{signUpErrors.role.message}</span>}
              </div>
              <Button type="submit" className="w-full bg-purple-900" disabled={isSignUpExecuting}>
                {isSignUpExecuting ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
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
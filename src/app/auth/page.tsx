// "use client"

// import { useEffect, useState, useCallback } from "react"
// import { useRouter } from "next/navigation"
// // import { useForm, SubmitHandler, Controller } from "react-hook-form"
// // import { Eye, EyeOff, UserPlus, LogIn, Loader } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { loginUserAction, signUpUserAction } from "../actions/auth"
// import { useAction } from 'next-safe-action/hooks'
// import { toast } from "sonner"

// enum UserRole {
//   MEMBER = "MEMBER",
//   FELLOWSHIP_LEADER = "FELLOWSHIP_LEADER",
//   ZONE_LEADER = "ZONE_LEADER",
//   CELL_LEADER = "CELL_LEADER",
//   ADMIN = "ADMIN"
// }

// const roles = [
//   { id: UserRole.MEMBER, label: "Member" },
//   { id: UserRole.FELLOWSHIP_LEADER, label: "Fellowship Leader" },
//   { id: UserRole.ZONE_LEADER, label: "Zone Leader" },
//   { id: UserRole.CELL_LEADER, label: "Cell Leader" },
//   { id: UserRole.ADMIN, label: "Admin" },
// ]

// // type LoginInputs = {
// //   email: string
// //   password: string
// // }

// // type SignUpInputs = {
// //   firstname: string
// //   lastname: string
// //   email: string
// //   password: string
// //   role: UserRole
// // }

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true)
//   const [showPassword, setShowPassword] = useState(false)
//   const router = useRouter()

//   // const { 
//   //   register: registerLogin, 
//   //   handleSubmit: handleSubmitLogin, 
//   //   formState: { errors: loginErrors },
//   //   reset: resetLogin
//   // } = useForm<LoginInputs>()

//   // const { 
//   //   register: registerSignUp, 
//   //   handleSubmit: handleSubmitSignUp, 
//   //   formState: { errors: signUpErrors },
//   //   reset: resetSignUp,
//   //   control
//   // } = useForm<SignUpInputs>({
//   //   defaultValues: {
//   //     role: UserRole.MEMBER
//   //   }
//   // })

//   const { execute: executeLogin, result: loginResult, isExecuting: isLoginExecuting } = useAction(loginUserAction)
//   const { execute: executeSignUp, isExecuting: isSignUpExecuting, result: registerResult } = useAction(signUpUserAction)

//   const onLoginSubmit: SubmitHandler<LoginInputs> = (data) => {
//     console.log("Login form submitted", data)
//     executeLogin(data)
//   }

//   const onSignUpSubmit: SubmitHandler<SignUpInputs> = (data) => {
//     console.log("Sign up form submitted", data)
//     executeSignUp(data)
//   }

//   const handleSuccessfulAuth = useCallback((message: string) => {
//     toast.success(message)
//     resetLogin()
//     setTimeout(() => {
//       router.push("/home")
//     }, 100)
//   }, [router, resetLogin])

//   const handleRegisterSuccessfulAuth = useCallback((message: string) => {
//     toast.success(message)
//     resetSignUp()
//     setTimeout(() => {
//       router.refresh()
//     }, 100)
//   }, [router, resetSignUp])

//   useEffect(() => {
//     if (loginResult?.data?.success === true) {
//       handleSuccessfulAuth("Login successful!")
//     } else if (loginResult?.data?.success === undefined) {
//       toast.error(loginResult?.data?.message)
//     }
//   }, [loginResult, handleSuccessfulAuth])

//   useEffect(() => {
//     if (registerResult?.data?.success === true) {
//       setIsLogin(true)
//       handleRegisterSuccessfulAuth("Registration successful!")
//     } else if (registerResult?.data?.success === undefined) {
//       toast.error(registerResult?.data?.message)
//     }
//   }, [registerResult, handleRegisterSuccessfulAuth])

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
//         <div className="p-8">
//           <h2 className="text-3xl font-bold text-center mb-6">
//             {isLogin ? "Welcome Back" : "Create Account"}
//           </h2>
//           {isLogin ? (
//             <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="loginEmail">Email</Label>
//                 <Input 
//                   id="loginEmail" 
//                   type="email" 
//                   placeholder="john@example.com" 
//                   {...registerLogin("email", { required: "Email is required" })} 
//                   disabled={isLoginExecuting}
//                 />
//                 {loginErrors.email && <span className="text-red-500 text-sm">{loginErrors.email.message}</span>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="loginPassword">Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="loginPassword"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     {...registerLogin("password", { required: "Password is required" })}
//                     disabled={isLoginExecuting}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700"
//                     disabled={isLoginExecuting}
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//                 {loginErrors.password && <span className="text-red-500 text-sm">{loginErrors.password.message}</span>}
//               </div>
//               <Button type="submit" className="w-full bg-purple-900 text-white" disabled={isLoginExecuting}>
//                 {isLoginExecuting ? (
//                   <>
//                     <Loader className="mr-2 h-4 w-4 animate-spin" />
//                     Logging in...
//                   </>
//                 ) : (
//                   "Log In"
//                 )}
//               </Button>
//             </form>
//           ) : (
//             <form onSubmit={handleSubmitSignUp(onSignUpSubmit)} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstname">First Name</Label>
//                 <Input 
//                   id="firstname" 
//                   placeholder="John" 
//                   {...registerSignUp("firstname", { required: "First name is required" })} 
//                   disabled={isSignUpExecuting}
//                 />
//                 {signUpErrors.firstname && <span className="text-red-500 text-sm">{signUpErrors.firstname.message}</span>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lastname">Last Name</Label>
//                 <Input 
//                   id="lastname" 
//                   placeholder="Doe" 
//                   {...registerSignUp("lastname", { required: "Last name is required" })} 
//                   disabled={isSignUpExecuting}
//                 />
//                 {signUpErrors.lastname && <span className="text-red-500 text-sm">{signUpErrors.lastname.message}</span>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input 
//                   id="email" 
//                   type="email" 
//                   placeholder="john@example.com" 
//                   {...registerSignUp("email", { required: "Email is required" })} 
//                   disabled={isSignUpExecuting}
//                 />
//                 {signUpErrors.email && <span className="text-red-500 text-sm">{signUpErrors.email.message}</span>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     {...registerSignUp("password", { required: "Password is required" })}
//                     disabled={isSignUpExecuting}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700"
//                     disabled={isSignUpExecuting}
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//                 {signUpErrors.password && <span className="text-red-500 text-sm">{signUpErrors.password.message}</span>}
//               </div>
//               <div className="space-y-2">
//                 <Label>Role</Label>
//                 <Controller
//                   name="role"
//                   control={control}
//                   rules={{ required: "Role is required" }}
//                   render={({ field }) => (
//                     <RadioGroup
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       className="flex flex-wrap gap-4"
//                       disabled={isSignUpExecuting}
//                     >
//                       {roles.map((role) => (
//                         <div key={role.id} className="flex items-center space-x-2">
//                           <RadioGroupItem value={role.id} id={role.id} />
//                           <Label htmlFor={role.id}>{role.label}</Label>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                   )}
//                 />
//                 {signUpErrors.role && <span className="text-red-500 text-sm">{signUpErrors.role.message}</span>}
//               </div>
//               <Button type="submit" className="w-full bg-purple-900 text-white" disabled={isSignUpExecuting}>
//                 {isSignUpExecuting ? (
//                   <>
//                     <Loader className="mr-2 h-4 w-4 animate-spin" />
//                     Signing up...
//                   </>
//                 ) : (
//                   "Sign Up"
//                 )}
//               </Button>
//             </form>
//           )}
//         </div>
//         <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
//           <p className="text-sm text-gray-600">
//             {isLogin ? "Need an account?" : "Already have an account?"}
//           </p>
//           <Button
//             variant="ghost"
//             onClick={() => {
//               setIsLogin(!isLogin)
//               resetLogin()
//               resetSignUp()
//             }}
//             className="text-sm"
//           >
//             {isLogin ? (
//               <UserPlus className="mr-2 h-4 w-4" />
//             ) : (
//               <LogIn className="mr-2 h-4 w-4" />
//             )}
//             {isLogin ? "Sign Up" : "Log In"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"
import React from 'react'

const page = () => {
const signIn=()=>
{
  try {
    fetch("https://mystic-backend.onrender.com",
      {
        method: "POST",
        body:JSON.stringify({
          role: "FELLOWSHIP_LEADER",
          member_id:"041759a3-935a-465b-a448-66a2297c4d42",
         fellowshipId: "b6796708-57a1-4c60-931e-52d7a8d714cf"
        })
      }
    )
  } catch (error) {
    console.log(error)
  }
 
}
  return (
    <div className=''>
      <button  onClick={signIn} className='bg-purple-500 text-white px-5 py-2 rounded-sm'>
        Sign In With Google
      </button>
    </div>
  )
}

export default page

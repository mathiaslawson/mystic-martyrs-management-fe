"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const page = () => {
    const router =  useRouter();
    useEffect(()=>{
        setTimeout(()=>{
            router.push("/home")
        },4000)
    },[])
  return (
   <main className="bg-white h-screen flex flex-col jusitfy-center items-center">
    <h1>Awesome. You have successfully logged in to Mystic-Martyrs-Management System </h1>
    <span className='text-gray-300 text-sm'>You will automatically be redirected to the dashboard.</span>
    </main>
  )
}

export default page

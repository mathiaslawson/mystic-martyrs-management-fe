import React from 'react'
import Noisebackground from "@/components/theme/Noisebackground"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <Noisebackground />
     <div className="relative auth-body">
      {/* <Noisebackground /> */}
      {children}
    </div>
    </>
  )
}
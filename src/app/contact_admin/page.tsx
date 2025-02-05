import React from 'react'
import Link from "next/link"

const page = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <span>
        You are unable to login due to administrative restrictions. Please contact your administrator for access to your account.
      </span>
      <span>Return to <Link href="/auth" className="text-blue-500">
      Login</Link></span>
    </div>
  )
}

export default page

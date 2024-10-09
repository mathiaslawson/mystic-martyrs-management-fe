'use client'

import React, { createContext, useContext, useState } from 'react'

type AccountData = {
  // Define the shape of your account data here
  id: string
  username: string
  email: string
  firstname: string
  lastname: string
  // Add other fields as necessary
}

type AuthContextType = {
  accountData: AccountData | null
  setAccountData: React.Dispatch<React.SetStateAction<AccountData | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accountData, setAccountData] = useState<AccountData | null>(null)
   
  return (
    <AuthContext.Provider value={{ accountData, setAccountData }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
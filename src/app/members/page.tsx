'use client'

import { withAuth } from "@/components/hoc/withAuth"
import { useAction } from "next-safe-action/hooks"
import { useEffect } from "react"
import Image from "next/image"

import {  Loader, Mail, RocketIcon, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

import { getAllMembersAction } from "../actions/auth"

function Home() {
  const { execute: getMembers, result: members, status } = useAction(getAllMembersAction)

  useEffect(() => {
    getMembers()
  }, [getMembers])


  return (
    <div className="xl:mt-[-1.6rem] mt-10">
      <div className="flex flex-col">
        <div className="flex h-5 items-center space-x-4 text-sm"></div> 
        {/* Notify */}
        <div className="border-purple-600 mt-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-md p-4 shadow-lg">
          <div className="flex items-center justify-between h-[15svh]">
            <div className="flex items-center space-x-4 text-purple-200">
              <div>
                <h2 className="text-3xl font-bold text-white">Members</h2>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/images/menorah.png"
                alt="Notification illustration"
                width={200}
                height={200}
                className="rounded-full bg-transparent p-2"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {status === 'executing' ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <Loader className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : members && members.data ? (
              members?.data?.data?.map((member : { firstname: string, lastname: string, email: string, role: string }) => (
              
             
                <>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between h-[8svh]">
                      <div className="flex items-center space-x-4 text-black">
                          <div className="flex items-center space-x-2 text-muted-foreground"> 
                             <User size={21} />
                          <h2 className="text-xl font-bold">{`${member.firstname} ${member.lastname}`}</h2>
                        </div>
                      </div>           
                      </div>
                      
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail size={16} />
                          <span>{member?.email}</span>
                    </div>            
                  </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground ">
                    <RocketIcon size={16} />
                          <span className="text-neutral-100 bg-purple-600 p-1 px-2 rounded-2xl text-xs">{member?.role}</span>
                    </div>            
                  </div>     
                      
                    <div className="border-purple-600 mt-3 bg-gradient-to-r from-purple-500 to-purple-700 shadow-lg w-full h-2 rounded-full"></div>
                  </CardContent>
                </Card>
                </>
              
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No fellowships found. Try refreshing the page.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(Home)
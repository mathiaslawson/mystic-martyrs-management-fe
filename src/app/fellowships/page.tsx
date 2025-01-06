'use client'

import { withAuth } from "@/components/hoc/withAuth"
import { useAction } from "next-safe-action/hooks"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Loader, TentTree } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AddFellowshipModal } from "./AddFellowshipModal"
import { getAllFellowships } from "../actions/fellowships"

function Home() {
  const { execute: getFellowships, result: fellowships, status } = useAction(getAllFellowships)

  useEffect(() => {
    getFellowships()
  }, [getFellowships])

  console.log(fellowships, 'this is the ')

  const handleFellowshipAdd = () => {
    getFellowships()
  }

  return (
    <div className="xl:mt-[-1.6rem] mt-10">
      <div className="flex flex-col">
        <div className="flex h-5 items-center space-x-4 text-sm"></div> 
        {/* Notify */}
        <div className="border-red-600 mt-10 bg-gradient-to-r from-red-500 to-red-700 rounded-md p-4 shadow-lg">
          <div className="flex items-center justify-between h-[15svh]">
            <div className="flex items-center space-x-4 text-purple-200">
              <div>
                <h2 className="text-3xl font-bold text-white">Fellowships</h2>
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

        {/* Add Zone Button */}
        <div className="mt-4 mb-6">
          <AddFellowshipModal onFellowshipAdded={handleFellowshipAdd} />
        </div>

        {/* Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {status === 'executing' ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <Loader className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : fellowships && fellowships.data ? (
              fellowships?.data?.data?.map((fellowship : { fellowship_id: number, fellowship_name: string, cells: [] }) => (
              
              <Link href={`/fellowships/${fellowship.fellowship_id}`} key={fellowship.fellowship_id}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between h-[8svh]">
                      <div className="flex items-center space-x-4 text-black">
                        <div>
                          <h2 className="text-2xl font-bold">{fellowship.fellowship_name}</h2>
                        </div>
                      </div>           
                      </div>
                      
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                    <TentTree size={16} />
                          <span>{fellowship?.cells?.length}{ " " }Cells</span>
                    </div>
                     <ChevronRight className="text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                      
                    <div className="border-red-600 mt-3 bg-gradient-to-r from-red-500 to-red-700 shadow-lg w-full h-2 rounded-full"></div>
                  </CardContent>
                </Card>
                </Link>
                
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
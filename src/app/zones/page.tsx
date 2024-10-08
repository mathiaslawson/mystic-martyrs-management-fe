'use client'

import { withAuth } from "@/components/hoc/withAuth"
import { useAction } from "next-safe-action/hooks"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getAllZones } from "../actions/zones"
import { Loader } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AddZoneModal } from "./AddZoneModal"

function Home() {
  const { execute: getZones, result: zones, status } = useAction(getAllZones)

  useEffect(() => {
    getZones()
  }, [getZones])

  const handleZoneAdded = () => {
    getZones()
  }

  return (
    <div className="xl:mt-[-1.6rem] mt-10">
      <div className="flex flex-col">
        <div className="flex h-5 items-center space-x-4 text-sm"></div> 
        {/* Notify */}
        <div className="border-yellow-600 mt-10 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-md p-4 shadow-lg">
          <div className="flex items-center justify-between h-[15svh]">
            <div className="flex items-center space-x-4 text-purple-200">
              <div>
                <h2 className="text-3xl font-bold text-white">Zones</h2>
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
          <AddZoneModal onZoneAdded={handleZoneAdded} />
        </div>

        {/* Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {status === 'executing' ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <Loader className="h-8 w-8 animate-spin text-yellow-600" />
            </div>
          ) : zones && zones.data ? (
            zones?.data?.data?.map((zone: { zone_id: string, zone_name: string, zone_leader_id: string, zone_location: string, created_at: string, updated_at: string, zone_leader: { member_id: string, user_id: string, firstname: string, lastname: string, email: string, gender: string, role: string, birth_date: string, occupation: string, address: string }, fellowships: { fellowship_id: string, zone_id: string, fellowship_name: string, fellowship_leader_id: string, created_at: string, updated_at: string }[] }) => (
              <Link href={`/zones/${zone.zone_id}`} key={zone.zone_id}>
                <Card className="hover:cursor-pointer hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between h-[8svh]">
                      <div className="flex items-center space-x-4 text-black">
                        <div>
                          <h2 className="text-2xl font-bold">{zone.zone_name}</h2>
                        </div>
                      </div>           
                    </div>
                    <div className="border-yellow-600 mt-3 bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-lg w-full h-2 rounded-full"></div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No zones found. Try refreshing the page.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(Home)
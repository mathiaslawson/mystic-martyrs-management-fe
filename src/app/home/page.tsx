
'use client'

import { withAuth } from "@/components/hoc/withAuth";
import { Button } from "@/components/ui/button";
import { ChurchIcon, Navigation, Radar, Users } from "lucide-react";
import Image from "next/image";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";

function Home() {

// const {user} = useUser();

const {me} = useAuthMemberStore()

console.log(me?.data?.firstname, 'this is me')

if(!me){
  return <div>Loading</div>
}

  return (
    <div className="xl:mt-[-1.6rem] mt-10">
      <div className="flex flex-col">
        <div className="flex h-5 items-center space-x-4 text-sm">

        </div>
        
        {/* Notify */}
  <div className="border-2 border-purple-600 p-4 rounded-md bg-gradient-to-r from-purple-500 to-purple-700 shadow-lg">
      <div className="flex items-center justify-between h-[20svh]">
        <div className="flex items-center space-x-4 text-purple-200">
        
          <div>
                <h2 className="text-3xl font-bold text-white">Shalom, {me?.data?.firstname} {me?.data.lastname}</h2>
                <p className="font-light text-md mb-11">{me?.data?.role}</p>
         
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          
  <div className="p-4 mt-10 rounded-md bg-neutral-100 shadow-lg  border border-l border-gradient-to-r from-yellow-500 to-yellow-700">
      <div className="flex items-center justify-between h-[20svh]">
        <div className="flex items-center space-x-4 text-black">
                    <Navigation className="h-6 w-6" />
          <div>
            <h2 className="xl:text-3xl text-2xl font-bold">Zones</h2>
            <Button className="bg-purple-600 text-white text-sm font-Poppins py-2 px-6">See All</Button>
          </div>
      </div>           
        <p className="text-purple-900 font-extrabold text-6xl mx-10">
          10
        </p>
      </div>
       
     
  </div>
  
  <div className="p-4 mt-10 rounded-md bg-gradient-to-r from-neutral-200 to-neutral-100 shadow-lg">
      <div className="flex items-center justify-between h-[20svh]">
        <div className="flex items-center space-x-4 text-black">
          <ChurchIcon className="h-6 w-6" />
          <div>
            <h2 className="xl:text-3xl text-2xl font-bold">Fellowhips</h2>
            <p className="text-purple-900">(See all)</p>
          </div>
      </div>           
        <p className="text-purple-900 font-extrabold text-6xl mx-10">
          10
        </p>
      </div>
       
      <div className="border-red-600 mt-10 bg-gradient-to-r from-red-500 to-red-700 shadow-lg w-full h-2 rounded-full"></div>
  </div>

   <div className="p-4 mt-10 rounded-md bg-gradient-to-r from-neutral-200 to-neutral-100 shadow-lg">
      <div className="flex items-center justify-between h-[20svh]">
        <div className="flex items-center space-x-4 text-black">
          <Radar className="h-6 w-6" />
          <div>
            <h2 className="xl:text-3xl text-2xl font-bold">Cells</h2>
            <p className="text-purple-900">(See all)</p>
          </div>
      </div>           
        <p className="text-purple-900 font-extrabold text-6xl mx-10">
          10
        </p>
      </div>
       
      <div className="border-green-600 mt-10 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
          </div> 

    <div className="p-4 mt-10 rounded-md bg-gradient-to-r from-neutral-200 to-neutral-100 shadow-lg">
      <div className="flex items-center justify-between h-[20svh]">
        <div className="flex items-center space-x-4 text-black">
          <Users className="h-6 w-6" />
          <div>
            <h2 className="xl:text-3xl text-2xl font-bold">Members</h2>
            <p className="text-purple-900">(See all)</p>
          </div>
      </div>           
        <p className="text-purple-900 font-extrabold text-6xl mx-10">
          10
        </p>
      </div>
       
      <div className="border-purple-600 mt-10 bg-gradient-to-r from-purple-500 to-purple-700 shadow-lg w-full h-2 rounded-full"></div>
   </div>        
          
 

  </div>

        
      </div>
    </div>
  );
}


export default withAuth(Home)
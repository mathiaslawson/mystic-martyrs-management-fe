'use client'

import { withAuth } from "@/components/hoc/withAuth"
import { AttendanceForm } from "./modules/attendance-form"
import { AttendanceTable } from "./modules/attendance-table"


function Home() {



  return (
   <div className="mx-auto">
     <div className="border-2 border-green-600 p-4 rounded-md bg-gradient-to-r from-green-500 to-green-700 shadow-lg mb-5">
        <div className="flex items-center justify-between h-[20svh]">
          <div className="flex items-center space-x-4 text-green-200">
            <div>
              <h2 className="text-3xl font-bold text-white">Attendance Records</h2>
              <p className="font-light text-md mb-11">View the attendance statistics of designated cell members.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <AttendanceForm />
        <AttendanceTable />
      </div>
    </div>
  )
}

export default withAuth(Home)
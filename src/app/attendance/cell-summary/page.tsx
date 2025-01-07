'use client'

import { withAuth } from "@/components/hoc/withAuth"


function CellSummary() {



  return (
    <div className="xl:mt-[-1.6rem] mt-10">
      dashboard of cell members and cell stats - should be allowed to record attendances here
    </div>
  )
}

export default withAuth(CellSummary)
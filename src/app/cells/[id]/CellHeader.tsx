"use client"

import Link from "next/link"
import { ArrowLeft, Edit, RefreshCw, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CellHeaderProps {
  refreshData: () => void
  isRefreshing: boolean
  setIsEditOpen: (value: boolean) => void
  setIsMitosisOpen: (value: boolean) => void
}

export default function CellHeader({ refreshData, isRefreshing, setIsEditOpen, setIsMitosisOpen }: CellHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <Link href="/cells">
        <Button variant="outline" className="bg-green-800 text-white hover:bg-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cells
        </Button>
      </Link>
      <div className="flex items-center space-x-2">
        <Button onClick={refreshData} disabled={isRefreshing} className="text-black">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
        <Button className="text-black mr-2" onClick={() => setIsEditOpen(true)}>
          <Edit className="mr-2 h-4" /> Edit
        </Button>
        <Button className="text-black" onClick={() => setIsMitosisOpen(true)}>
          <GitBranch className="mr-2 h-4" /> Mitosis
        </Button>
      </div>
    </div>
  )
}


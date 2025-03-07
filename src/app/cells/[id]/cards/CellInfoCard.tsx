import { Star } from "lucide-react"
import { CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { CellData } from "../../@types"

export default function CellInfoCard({ cellData }: { cellData: CellData }) {
  return (
    <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-1">
      <CardHeader className="text-black rounded-t-lg bg-green-100">
        <CardTitle>Cell Information</CardTitle>
        <CardDescription className="text-green-900">Details about the cell</CardDescription>
        <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {cellData?.cell?.cell_name}
            </Badge>
            <div className="flex gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Division Level:{" "}
                <p className="ml-3 gap-2 flex items-center">
                  <Star className="text-yellow-400 fill-yellow-400" size={10} />
                  {cellData?.cell?.division_level}
                </p>
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarDays className="w-5 h-5 text-green-600" />
            <span>Created on {formatDate(cellData?.cell?.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


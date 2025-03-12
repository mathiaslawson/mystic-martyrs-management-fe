import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { CellData } from "../../@types";
import { CalendarDays, GitBranch, Layers } from "lucide-react";

export default function CellMitosisHistoryCard({
  cellData,
}: {
  cellData: CellData;
}) {
  return (
    <>
      <>
     <div className="mb-10">
  {cellData?.sub_cells?.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {cellData?.sub_cells?.map((sub) => (
        <Card
          key={sub?.cell_id}
          className="w-full min-h-[250px] flex flex-col justify-between overflow-hidden border-none shadow-md transition-all duration-300 group"
        >
          <CardHeader className="pb-2 pt-6 bg-gradient-to-b from-green-50 to-transparent">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <div className="bg-green-100 p-2 rounded-full">
                  <GitBranch className="h-5 w-5 text-green-600" />
                </div>
                {sub?.cell_name}
              </CardTitle>
              <Badge
                variant="outline"
                className={`${
                  sub?.became_fellowship
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-green-100 text-green-700 border-green-200"
                } px-3 py-1 text-xs rounded-full font-medium mx-4`}
              >
                {sub?.became_fellowship ? "Fellowship" : "Not Fellowship"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-6 flex-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <Layers className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-green-700 font-medium block">
                    Division Level
                  </span>
                  <span className="text-lg font-semibold text-green-900">
                    {sub?.division_level}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <CalendarDays className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-green-700 font-medium block">
                    Created On
                  </span>
                  <span className="text-sm font-medium text-green-900">
                    {formatDate(sub?.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-center text-neutral-500 mt-10 mb-6 text-sm">
      <div className="p-8 border border-dashed border-green-200 rounded-lg bg-green-50/50">
        <GitBranch className="h-10 w-10 text-green-300 mx-auto mb-2" />
        No Sub Cells Found
      </div>
    </div>
  )}
</div>

      </>

      <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
        <CardHeader className="bg-green-100 text-black rounded-t-lg">
          <CardTitle>Cell Mitosis History</CardTitle>
          <CardDescription className="text-green-900">
            Mitosys History for {cellData?.cell?.cell_name}
          </CardDescription>
          <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent Cell</TableHead>
                <TableHead>Child Cell</TableHead>
                <TableHead>Previous Level</TableHead>
                <TableHead>Current Level</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Division Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cellData?.history?.map((history) => (
                <TableRow key={history?.cell_id}>
                  <TableCell>{history?.cell?.cell_name}</TableCell>
                  <TableCell>{history?.child_cell_name}</TableCell>
                  <TableCell>{history?.division_level}</TableCell>
                  <TableCell>{history?.cell?.division_level}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-md"
                    >
                      {history?.reason_for_division}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(history?.division_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-center text-neutral-500 mt-10 text-sm">
            {cellData?.history?.length === 0 &&
              "No Cell Division History Found"}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

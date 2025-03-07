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
import { CellData } from "../../@types";

export default function CellMitosisHistoryCard({
  cellData,
}: {
  cellData: CellData;
}) {
  return (
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
            {cellData?.history?.map(
              (history) => (
                <TableRow key={history?.cell_id}>
                  <TableCell>{history?.cell?.cell_name}</TableCell>
                  <TableCell>{history?.child_cell_name}</TableCell>
                  <TableCell>{history?.division_level}</TableCell>
                  <TableCell>{history?.cell?.division_level}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                    >
                      {history?.reason_for_division}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(history?.division_date)}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <div className="text-center text-neutral-500 mt-10 text-sm">
          {cellData?.history?.length === 0 && "No Cell Division History Found"}
        </div>
      </CardContent>
    </Card>
  );
}

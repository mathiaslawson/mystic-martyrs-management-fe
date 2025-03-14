import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";
import { CellData } from "../../@types";

const ITEMS_PER_PAGE = 5;

export default function CellTransferHistory({
  cellData,
}: {
  cellData: CellData;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredData = cellData?.transfer_history?.filter((item) =>
    item.member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData?.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
      <CardHeader className="bg-green-100 text-black rounded-t-lg">
        <CardTitle>Cell Leaders</CardTitle>
        <CardDescription className="text-green-900">
          Leaders heading this Cell
        </CardDescription>
        <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4 mt-4">
          <Input
            placeholder="Search by Member Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm"
          />
        </div>
        <Table className="w-full min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">From Cell</TableHead>
              <TableHead className="font-semibold">To Cell</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Remarks</TableHead>
              <TableHead className="font-semibold">Old Status</TableHead>
              <TableHead className="font-semibold">New Status</TableHead>
              <TableHead className="font-semibold">Transferred By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.transfer_id}
                className={cn(
                  "transition-colors",
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                )}
              >
                <TableCell className="font-medium">
                  {item.from_cell?.name ?? "—"}
                </TableCell>
                <TableCell className="font-medium">
                  {item.to_cell?.name ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(item.transfer_date)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {item.remarks || "—"}
                </TableCell>
                <TableCell className="text-red-600 font-semibold">
                  {item.old_status ?? "—"}
                </TableCell>
                <TableCell className="text-green-600 font-semibold">
                  {item.new_status ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.transferred_by || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-10 mb-10 flex justify-center">
            {paginatedData.length === 0 && <>
            <div className="text-neutral-400">No Transfers</div>
            </>}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

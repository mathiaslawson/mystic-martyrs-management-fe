"use client"

import type { Member } from "@/app/cells/@types"
import { transferHistoryByMemberId } from "@/components/@Global/actions/cells/transfer"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Search, ChevronLeft, ChevronRight, History, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type TransferHistory = {
  created_at: string
  from_cell: { cell_name: string }
  history_id: string
  member: Member
  new_status: string
  old_status: string
  remarks: string
  to_cell: { cell_name: string }
  transferred_by: string
  updated_at: string
}

type TransferHistoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedMember: Member | null
}

export function TransferHistoryDialog({ open, onOpenChange, selectedMember }: TransferHistoryDialogProps) {
  const { execute: fetchTransferHistory, status, result } = useAction(transferHistoryByMemberId)

  const [history, setHistory] = useState<TransferHistory[]>([])
  const [filteredHistory, setFilteredHistory] = useState<TransferHistory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    if (open && selectedMember?.member_id) {
      fetchTransferHistory({ member_id: selectedMember.member_id })
    }
  }, [open, selectedMember, fetchTransferHistory])

  useEffect(() => {
    if (status === "hasSucceeded") {
      setHistory(result?.data?.data || [])
      setFilteredHistory(result?.data?.data || [])
      if (result.data?.data?.length === 0) {
        toast.info("No transfer history found.")
      }
    } else if (status === "hasErrored") {
      toast.error("Failed to fetch transfer history.")
    }
  }, [status, result])

  useEffect(() => {
    const filtered = history.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredHistory(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchQuery, history])

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] md:max-w-screen-lg w-full p-0 overflow-hidden rounded-lg">
        <DialogHeader className="p-6 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl">Transfer History</DialogTitle>
          </div>
          <DialogDescription className="mt-1.5">
            {selectedMember ? (
              <span className="font-medium text-foreground">
                {selectedMember.firstname} {selectedMember.lastname}
              </span>
            ) : (
              "Member"
            )}
            &apos;s transfer records and status changes
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-auto">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search by cell, status, remarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:outline-none transition-all"
            />
          </div>

          {status === "executing" ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
              <p className="text-muted-foreground">Loading transfer history...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            <>
              <div className="w-full overflow-auto rounded-lg border">
                <Table className="w-full min-w-[800px]">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="whitespace-nowrap font-semibold">From Cell</TableHead>
                      <TableHead className="whitespace-nowrap font-semibold">To Cell</TableHead>
                      <TableHead className="whitespace-nowrap font-semibold">Date</TableHead>
                      <TableHead className="whitespace-nowrap font-semibold">Remarks</TableHead>
                      <TableHead className="whitespace-nowrap font-semibold">Old Status</TableHead>
                      <TableHead className="whitespace-nowrap font-semibold">New Status</TableHead>
                      <TableHead className="whitespace-nowrap font-semibold">Transferred By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHistory.map((item, index) => (
                      <TableRow
                        key={item.history_id}
                        className={cn("transition-colors", index % 2 === 0 ? "bg-background" : "bg-muted/20")}
                      >
                        <TableCell className="font-medium">{item.from_cell?.cell_name ?? "—"}</TableCell>
                        <TableCell className="font-medium">{item.to_cell?.cell_name ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(item.created_at)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{item.remarks || "—"}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-medium",
                              getStatusBadgeClass(item.old_status),
                            )}
                          >
                            {item.old_status || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-medium",
                              getStatusBadgeClass(item.new_status),
                            )}
                          >
                            {item.new_status || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.transferred_by || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                      <span className="font-medium text-foreground">{totalPages}</span>
                    </span>
                  </div>
                  <Button
                    onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium mb-1">No transfer history</h3>
              <p className="text-muted-foreground max-w-md">
                No transfer records were found for this member. Records will appear here when transfers occur.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t bg-muted/30">
          <Button onClick={() => onOpenChange(false)} type="button">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


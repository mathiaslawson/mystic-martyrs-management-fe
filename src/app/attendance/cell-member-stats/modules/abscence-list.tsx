import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Absence {
  date: string
  remarks: string
}

interface AbsenceListProps {
  absences: Absence[]
}

export function AbsenceList({ absences }: AbsenceListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Absence Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {absences.map((absence, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(absence.date).toLocaleDateString()}</TableCell>
                <TableCell>{absence.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
       <CardHeader className="bg-green-100 text-black rounded-t-lg">
          <CardTitle>Abscence Record</CardTitle>
          <CardDescription className="text-green-900">
          
          </CardDescription>
          <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
        </CardHeader>
      <CardContent>
        {absences.length === 0 ? (
          <p className="mt-3 text-center flex justify-center text-neutral-600">No attendaces recorded.</p>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}


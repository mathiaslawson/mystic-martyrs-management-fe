import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { CellData } from "../../@types"

export default function CellMembersCard({ cellData }: { cellData: CellData }) {
  return (
    <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group lg:col-span-3">
      <CardHeader className="bg-green-100 text-black rounded-t-lg">
        <CardTitle>Cell Memebers</CardTitle>
        <CardDescription className="text-green-900">Members within this cell</CardDescription>
        <div className="border-green-600 mt-3 bg-gradient-to-r from-green-500 to-green-700 shadow-lg w-full h-2 rounded-full"></div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cellData?.cell?.members?.map(
              (leaders: {
                member_id: string
                firstname: string
                created_at: string
                lastname: string
                email: string
                role: string
              }) => (
                <TableRow key={leaders?.member_id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${leaders?.firstname} ${leaders?.lastname}`}
                        />
                        <AvatarFallback>
                          {leaders?.firstname}
                          {leaders?.lastname}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-lg">
                          {leaders?.firstname} {leaders?.lastname}
                        </p>
                        <p className="text-sm text-gray-500">{leaders?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{leaders?.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {leaders?.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(leaders?.created_at)}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
        <div className="text-center text-neutral-500 mt-10 text-sm">
          {cellData?.cell?.members.length === 0 && "No Cell Members"}
        </div>
      </CardContent>
    </Card>
  )
}


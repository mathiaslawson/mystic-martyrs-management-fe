"use client"

import { useState } from 'react'
import AsyncSelect from 'react-select/async'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/ui/date-picker"

// Mock API call
const fetchMembers = async (inputValue: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const members = [
    { value: "d4e1b7bf-7f37-4996-9de7-660f6f540ab9", label: "Mathias Lawson" },
    { value: "2", label: "Jane Doe" },
    { value: "3", label: "John Smith" },
    { value: "4", label: "Alice Johnson" },
    { value: "5", label: "Bob Williams" },
    { value: "6", label: "Carol Brown" },
    { value: "7", label: "David Lee" },
    { value: "8", label: "Eva Garcia" },
    { value: "9", label: "Frank Wilson" },
    { value: "10", label: "Grace Taylor" },
  ]
  return members.filter(member => 
    member.label.toLowerCase().includes(inputValue.toLowerCase())
  )
}

export function AttendanceForm() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isPresent, setIsPresent] = useState(false)
  const [selectedMember, setSelectedMember] = useState<{ value: string; label: string } | null>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const attendanceData = {
      cell_id: "00e23fa1-12c8-439d-a2e4-f5b1300f4b64",
      member_id: selectedMember?.value,
      date: date?.toISOString(),
      is_present: isPresent
    }
    console.log('Submitting attendance:', attendanceData)
    setDate(new Date())
    setIsPresent(false)
    setSelectedMember(null)
  }

  const loadOptions = (inputValue: string) =>
    new Promise<{ value: string; label: string }[]>(resolve => {
      fetchMembers(inputValue).then(options => {
        resolve(options)
      })
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">Select Member</Label>
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions
              onChange={setSelectedMember}
              value={selectedMember}
              placeholder="Search for a member..."
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? 'black' : 'hsl(0, 0%, 80%)',
                  boxShadow: state.isFocused ? '0 0 0 1px black' : 'none',
                  '&:hover': {
                    borderColor: 'black',
                  },
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? 'hsl(0, 0%, 90%)' : 'white',
                  color: 'black',
                }),
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <DatePicker date={date} setDate={setDate} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is-present"
              checked={isPresent}
              onCheckedChange={setIsPresent}
            />
            <Label htmlFor="is-present">Present</Label>
          </div>
          <Button type="submit" disabled={!selectedMember}>Submit Attendance</Button>
        </form>
      </CardContent>
    </Card>
  )
}


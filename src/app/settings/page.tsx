'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { Users, Settings, BarChart } from 'lucide-react'

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('My Awesome Site')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('light')

  const handleSiteNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSiteName(event.target.value)
  }

  const handleMaintenanceModeToggle = (checked: boolean) => {
    setMaintenanceMode(checked)
  }

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value)
  }

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      <Tabs defaultValue="user-management">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user-management">
            <Users className="mr-2 h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="site-settings">
            <Settings className="mr-2 h-4 w-4" />
            Site Settings
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">John Doe</span>
                  <Select defaultValue="user">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Jane Smith</span>
                  <Select defaultValue="moderator">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('User roles updated!')}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="site-settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Manage your site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" value={siteName} onChange={handleSiteNameChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance-mode"
                  checked={maintenanceMode}
                  onCheckedChange={handleMaintenanceModeToggle}
                />
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={selectedTheme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>View your site statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Users</span>
                  <span className="text-2xl font-bold">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Active Users (Last 30 days)</span>
                  <span className="text-2xl font-bold">789</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Average Session Duration</span>
                  <span className="text-2xl font-bold">5m 23s</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">View Detailed Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi, CreditCard, Settings, AlertTriangle, RefreshCw, Download, Users } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maxConcurrentUsers: 100,
    sessionTimeout: 24,
    autoDisconnect: true,
    maintenanceMode: false,
    mpesaTimeout: 60,
    defaultPackage: "24hours",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await apiClient.getSystemSettings()
      if (response.success && response.data) {
        setSettings(response.data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    try {
      const response = await apiClient.updateSystemSettings(settings)
      if (response.success) {
        toast.success("Settings saved successfully", {
          description: "All system settings have been updated",
        })
      } else {
        throw new Error(response.error || "Failed to save settings")
      }
    } catch (error: any) {
      toast.error("Failed to save settings", {
        description: error.message,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Settings */}
        <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center">
              <Wifi className="h-5 w-5 mr-2" />
              Network Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Max Concurrent Users</Label>
              <Input
                type="number"
                value={settings.maxConcurrentUsers}
                onChange={(e) => handleSettingChange("maxConcurrentUsers", Number.parseInt(e.target.value))}
                className="mt-1 bg-white/50 dark:bg-slate-700/50"
              />
            </div>
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Session Timeout (hours)</Label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                className="mt-1 bg-white/50 dark:bg-slate-700/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-700 dark:text-slate-300">Auto Disconnect Expired Users</Label>
              <Button
                variant={settings.autoDisconnect ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange("autoDisconnect", !settings.autoDisconnect)}
              >
                {settings.autoDisconnect ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Payment Settings */}
        <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">M-Pesa Timeout (seconds)</Label>
              <Input
                type="number"
                value={settings.mpesaTimeout}
                onChange={(e) => handleSettingChange("mpesaTimeout", Number.parseInt(e.target.value))}
                className="mt-1 bg-white/50 dark:bg-slate-700/50"
              />
            </div>
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Default Package</Label>
              <Select
                value={settings.defaultPackage}
                onValueChange={(value) => handleSettingChange("defaultPackage", value)}
              >
                <SelectTrigger className="mt-1 bg-white/50 dark:bg-slate-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 Hour - Ksh 10</SelectItem>
                  <SelectItem value="4hours">4 Hours - Ksh 15</SelectItem>
                  <SelectItem value="12hours">12 Hours - Ksh 20</SelectItem>
                  <SelectItem value="24hours">24 Hours - Ksh 30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* System Control */}
        <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              System Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">Maintenance Mode</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">Disable new connections</p>
              </div>
              <Button
                variant={settings.maintenanceMode ? "destructive" : "outline"}
                size="sm"
                onClick={() => handleSettingChange("maintenanceMode", !settings.maintenanceMode)}
              >
                {settings.maintenanceMode ? "Active" : "Inactive"}
              </Button>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={saveSettings}>
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Quick Actions */}
        <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={async () => {
                toast.loading("Restarting network service...", { id: "restart-service" })
                try {
                  const response = await apiClient.restartNetworkService()
                  if (response.success) {
                    toast.success("Network service restarted successfully", { id: "restart-service" })
                  } else {
                    throw new Error(response.error)
                  }
                } catch (error) {
                  toast.error("Failed to restart network service", { id: "restart-service" })
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart Network Service
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={async () => {
                toast.loading("Creating database backup...", { id: "backup-db" })
                try {
                  const response = await apiClient.backupDatabase()
                  if (response.success) {
                    toast.success("Database backup completed", {
                      id: "backup-db",
                      description: "Backup saved to server storage",
                    })
                  } else {
                    throw new Error(response.error)
                  }
                } catch (error) {
                  toast.error("Failed to create backup", { id: "backup-db" })
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={async () => {
                if (confirm("Are you sure you want to disconnect all users?")) {
                  toast.loading("Disconnecting all users...", { id: "disconnect-all" })
                  try {
                    const response = await apiClient.disconnectAllUsers()
                    if (response.success) {
                      toast.success("All users disconnected", { id: "disconnect-all" })
                    } else {
                      throw new Error(response.error)
                    }
                  } catch (error) {
                    toast.error("Failed to disconnect users", { id: "disconnect-all" })
                  }
                }
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Disconnect All Users
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => {
                if (confirm("Are you sure you want to perform a factory reset? This action cannot be undone.")) {
                  toast.error("Factory reset not implemented", {
                    description: "This is a dangerous operation that requires manual intervention",
                  })
                }
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Factory Reset
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default SystemSettings

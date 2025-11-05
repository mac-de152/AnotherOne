import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const DeviceInfoPanel = ({ macAddress, status }: { macAddress: string; status: string }) => (
  <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10 backdrop-blur">
    <CardHeader>
      <CardTitle className="text-slate-900 dark:text-white">Device Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-slate-400">MAC Address:</span>
          <span className="text-slate-900 dark:text-white font-mono text-sm">{macAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-slate-400">Status:</span>
          <Badge
            variant="outline"
            className={
              status === "completed"
                ? "text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
                : "text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-400"
            }
          >
            {status === "completed" ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default DeviceInfoPanel

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Zap, Shield, Globe } from "lucide-react"

const InfoPanel = () => (
  <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10 backdrop-blur">
    <CardHeader>
      <CardTitle className="text-slate-900 dark:text-white">Why Choose Qonnect?</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-start space-x-3">
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
        <div>
          <h3 className="font-medium text-slate-900 dark:text-white">Lightning Fast</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">High-speed internet up to 5 Mbps</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
        <div>
          <h3 className="font-medium text-slate-900 dark:text-white">Secure Payments</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Protected M-Pesa transactions</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
        <div>
          <h3 className="font-medium text-slate-900 dark:text-white">Reliable Network</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">99.9% uptime guarantee</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default InfoPanel

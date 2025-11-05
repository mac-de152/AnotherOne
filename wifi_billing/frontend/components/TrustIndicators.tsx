import { Shield, Users, Globe } from "lucide-react"

const TrustIndicators = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-white/5">
      <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">Secure Payment</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">M-Pesa Protected</p>
      </div>
    </div>
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-white/5">
      <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">10,000+ Users</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Trusted Daily</p>
      </div>
    </div>
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-white/5">
      <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">99.9% Uptime</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Reliable Connection</p>
      </div>
    </div>
  </div>
)

export default TrustIndicators

"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Activity, DollarSign, TrendingUp } from "lucide-react"
import { SystemStats } from "@/lib/api"

const StatsCards = ({ stats }: { stats: SystemStats | null }) => {
  const defaultStats = {
    totalUsers: 0,
    activeUsers: 0,
    todayRevenue: 0,
    successRate: 0,
    pendingPayments: 0,
    blockedUsers: 0,
  }
  const currentStats = stats || defaultStats
  const statsConfig = [
    { title: "Total Users", value: currentStats.totalUsers.toLocaleString(), change: "+12%", icon: Users, color: "blue" },
    { title: "Active Sessions", value: currentStats.activeUsers.toString(), change: "+5%", icon: Activity, color: "green" },
    { title: "Today's Revenue", value: `Ksh ${currentStats.todayRevenue.toLocaleString()}`, change: "+18%", icon: DollarSign, color: "purple" },
    { title: "Success Rate", value: `${currentStats.successRate.toFixed(1)}%`, change: "+2.1%", icon: TrendingUp, color: "orange" },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{stat.change} from yesterday</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-500/10`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
export default StatsCards;

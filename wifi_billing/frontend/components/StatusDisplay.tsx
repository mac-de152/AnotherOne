import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

const StatusDisplay = ({ status }: { status: "pending" | "completed" | "failed" | "" }) => {
  if (!status) return null

  const statusConfig = {
    pending: {
      icon: Clock,
      className: "bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:text-yellow-300",
      text: "Processing payment...",
      iconClass: "animate-pulse",
    },
    completed: {
      icon: CheckCircle,
      className: "bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-300",
      text: "Payment successful! You're connected.",
      iconClass: "",
    },
    failed: {
      icon: AlertTriangle,
      className: "bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-300",
      text: "Payment failed. Please try again.",
      iconClass: "",
    },
  }

  const config = statusConfig[status]
  if (!config) return null
  const Icon = config.icon

  return (
    <div
      className={`flex items-center justify-center p-4 rounded-lg border transition-all duration-300 ${config.className}`}
    >
      <Icon className={`w-5 h-5 mr-3 ${config.iconClass}`} />
      <span className="font-medium">{config.text}</span>
    </div>
  )
}

export default StatusDisplay

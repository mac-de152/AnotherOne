import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface Package {
  label: string
  value: number
  price: string
  speed: string
  color: 'blue' | 'purple' | 'green' | 'yellow'
  popular: boolean
}

const colorClasses = {
  blue: "border-blue-500 bg-blue-500/10 shadow-blue-500/20",
  purple: "border-purple-500 bg-purple-500/10 shadow-purple-500/20",
  green: "border-green-500 bg-green-500/10 shadow-green-500/20",
  yellow: "border-yellow-500 bg-yellow-500/10 shadow-yellow-500/20",
}

const PackageCard = ({ pkg, isSelected, onSelect }: { pkg: Package; isSelected: boolean; onSelect: (value: number) => void }) => {
  return (
    <Card
      className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSelected
          ? `${colorClasses[pkg.color]} shadow-lg`
          : "border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/70"
      }`}
      onClick={() => onSelect(pkg.value)}
    >
      {pkg.popular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{pkg.price}</div>
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">{pkg.label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{pkg.speed}</div>
      </CardContent>
    </Card>
  )
}

export default PackageCard

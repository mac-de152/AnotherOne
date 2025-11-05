
import Link from "next/link"
import { Wifi } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

import { ReactNode } from "react"

interface AdminHeaderProps {
  children?: ReactNode
}

const AdminHeader = ({ children }: AdminHeaderProps) => (
  <header className="sticky top-0 z-50 w-full border-b border-slate-200/20 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Qonnect Admin</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Management Dashboard</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Back to Portal</Link>
          <ThemeToggle />
          {children}
        </div>
      </div>
    </div>
  </header>
)

export default AdminHeader;

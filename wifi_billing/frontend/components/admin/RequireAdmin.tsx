"use client"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Wrap a page/component to require admin authentication.
 * Redirects to /admin/login if not authenticated.
 * Usage: <RequireAdmin><YourComponent /></RequireAdmin>
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) return null // or a loading spinner
  if (!isAuthenticated) return null
  return <>{children}</>
}

"use client"

import { usePathname, useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { PROJECT_NAME } from "@/lib/constants"

type TitleOrFactory = string | (() => string)

export function usePageTitle(explicitTitle?: TitleOrFactory) {
  const pathname = usePathname()
  const params = useParams() as Record<string, string | string[] | undefined>
  const [dataTitle, setDataTitle] = useState<string | null>(null)

  // Default route-based titles
  const routeTitle = useMemo(() => {
    if (!pathname) return `Loading... - ${PROJECT_NAME}`
    if (typeof explicitTitle === "string") return `${explicitTitle} - ${PROJECT_NAME}`
    if (typeof explicitTitle === "function") return `${explicitTitle()} - ${PROJECT_NAME}`

    if (pathname === "/") return `Home - ${PROJECT_NAME}`
    if (pathname.startsWith("/about")) return `About Us - ${PROJECT_NAME}`
    if (pathname.startsWith("/admin")) return `Admin - ${PROJECT_NAME}`
    if (pathname.startsWith("/support")) return `Support - ${PROJECT_NAME}`
    if (pathname.startsWith("/packages")) return `Packages - ${PROJECT_NAME}`

    // Dynamic product route example: /products/[id]
    if (pathname.startsWith("/products/")) {
      return dataTitle ? `${dataTitle} - ${PROJECT_NAME}` : `Loading... - ${PROJECT_NAME}`
    }

    return `${PROJECT_NAME}`
  }, [pathname, explicitTitle, dataTitle])

  // Example: fetch product name for /products/[id]
  useEffect(() => {
    const isProductRoute = pathname?.startsWith("/products/")
    if (!isProductRoute) return
    const id = (params?.id as string) || pathname?.split("/")[2]
    if (!id) return

    let cancelled = false
    ;(async () => {
      try {
        // Replace with your real product fetch API if available
        // Fallback demo: synthesize a name using id
        const productName = `Product ${id}`
        if (!cancelled) setDataTitle(productName)
      } catch (_) {
        if (!cancelled) setDataTitle(null)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [pathname, params])

  // Update document title directly for client-side navigation
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = routeTitle
    }
  }, [routeTitle])

  return { title: routeTitle, setDataTitle }
}




"use client"

import { Toaster } from "sonner"
import { useTheme } from "@/hooks/use-theme"

export function ToastProvider() {
  const { theme } = useTheme()

  return (
    <Toaster
      theme={theme}
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: theme === "dark" ? "hsl(222.2 84% 4.9%)" : "hsl(0 0% 100%)",
          border: theme === "dark" ? "1px solid hsl(217.2 32.6% 17.5%)" : "1px solid hsl(214.3 31.8% 91.4%)",
          color: theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
        },
      }}
    />
  )
}

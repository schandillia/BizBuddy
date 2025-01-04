// src/components/dashboard-nav-button.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"

export const DashboardNavButton = () => {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <Link
      href="/dashboard"
      className={buttonVariants({
        size: "sm",
        className: "flex items-center gap-1 mr-4",
      })}
    >
      Dashboard
    </Link>
  )
}

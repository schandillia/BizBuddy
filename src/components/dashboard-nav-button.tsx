// src/components/dashboard-nav-button.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { Settings } from "lucide-react"

export const DashboardNavButton = () => {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard")) {
    return (
      <Link
        href="/settings"
        className={buttonVariants({
          size: "sm",
          variant: "ghost",
          className: "flex items-center gap-1 mr-4 sm:hidden",
        })}
        aria-label="Settings"
      >
        <Settings className="size-4 dark:text-white" />
      </Link>
    )
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

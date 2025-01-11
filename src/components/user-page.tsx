"use client"

import { ReactNode } from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { Heading } from "./heading"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { DashboardNavButton } from "./dashboard-nav-button"

interface UserPageProps {
  title: string
  children?: ReactNode
  hideBackButton?: boolean
  cta?: ReactNode
}

export const UserPage = ({
  title,
  children,
  cta,
  hideBackButton,
}: UserPageProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleBackButtonClick = () => {
    if (pathname === "/settings" || pathname === "/settings/profile") {
      router.push("/")
    } else {
      router.push("/settings")
    }
  }

  return (
    <section className="flex-1 h-full w-full flex flex-col">
      <div className="w-full p-6 sm:p-8 flex justify-between items-center border-b border-gray-200 dark:border-brand-900">
        {/* Left: Back Button and Heading */}
        <div className="flex items-center gap-4">
          {!hideBackButton && (
            <Button
              onClick={handleBackButtonClick}
              className="w-fit bg-white dark:bg-brand-950 dark:hover:bg-brand-900 dark:text-white"
              variant="outline"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <Heading>{title}</Heading>
        </div>

        {/* Right: DashboardNavButton */}
        <div className="hidden md:block">
          <DashboardNavButton />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  )
}

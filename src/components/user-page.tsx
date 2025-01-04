"use client"

import { ReactNode } from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { Heading } from "./heading"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname() // This will give you the current path

  const handleBackButtonClick = () => {
    // Check if we're on /settings, if so, navigate to /
    if (pathname === "/settings" || pathname === "/settings/profile") {
      router.push("/")
    } else {
      router.push("/settings")
    }
  }

  return (
    <section className="flex-1 h-full w-full flex flex-col">
      <div className="w-full p-6 sm:p-8 flex justify-between border-b border-gray-200 dark:border-brand-900">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-8">
            {hideBackButton ? null : (
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

          {cta ? <div className="w-full">{cta}</div> : null}
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  )
}

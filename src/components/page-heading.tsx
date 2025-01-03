import { ReactNode } from "react"

import { cn } from "@/utils"

export default function PageHeading({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <h1
      className={cn(
        "text-4xl font-extrabold lg:text-5xl text-soft dark:text-white",
        className
      )}
    >
      {children}
    </h1>
  )
}

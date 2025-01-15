// card-section.tsx
import { cn } from "@/utils"
import { HTMLAttributes } from "react"

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = ({
  className,
  children,
  ...props
}: CardSectionProps) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  )
}

export const CardContent = ({
  className,
  children,
  ...props
}: CardSectionProps) => {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

export const CardFooter = ({
  className,
  children,
  ...props
}: CardSectionProps) => {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

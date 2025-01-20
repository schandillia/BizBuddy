import { cn } from "@/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AnchorHTMLAttributes } from "react"

interface CTAButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const CTAButton = ({
  className,
  children,
  href,
  ...props
}: CTAButtonProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Link
        href={href ?? "#"}
        className={cn(
          "group relative flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-white bg-brand-700 px-8 text-base/7 font-medium text-white transition-all duration-300 hover:ring-2 hover:ring-brand-700 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          <ArrowRight className="size-4 shrink-0 text-white transition-transform duration-300 ease-in-out group-hover:translate-x-[2px]" />
        </span>

        <div className="custom-ease absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-8 rotate-[135deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]" />
      </Link>
      <p className="text-gray-600 dark:text-gray-300">
        Cancel anytime · No credit card needed
      </p>
    </div>
  )
}

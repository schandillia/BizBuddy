import { cn } from "@/utils"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { BrandLogo } from "../brand-logo"

interface SidebarProps {
  children?: ReactNode
  className?: string
  showSidebar?: boolean
  setShowSidebar?: Dispatch<SetStateAction<boolean>>
  onClose?: () => void
  preventDefaultClose?: boolean
  slideFrom?: "left" | "right"
  width?: string
}

export const Sidebar = ({
  children,
  className,
  onClose,
  preventDefaultClose,
  setShowSidebar,
  showSidebar,
  slideFrom = "right",
  width = "w-80",
}: SidebarProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (showSidebar) {
      setMounted(true)
      setIsClosing(false)
    }
  }, [showSidebar])

  const closeSidebar = () => {
    if (preventDefaultClose) return
    if (onClose) onClose()

    setIsClosing(true)

    setTimeout(() => {
      if (setShowSidebar) setShowSidebar(false)
      setMounted(false)
    }, 300)
  }

  return (
    <Dialog
      open={!!showSidebar}
      onOpenChange={(open) => {
        if (!open) closeSidebar()
      }}
    >
      {/* Invisible backdrop - only handles clicks */}
      <div
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-40",
          showSidebar ? "pointer-events-auto" : "pointer-events-none"
        )}
      />

      <div
        className={cn(
          "fixed inset-y-0 flex flex-col",
          slideFrom === "right" ? "right-0" : "left-0",
          width,
          "max-w-xs z-50",
          "bg-white dark:bg-brand-950",
          "border-l dark:border-brand-800",
          "transition-transform duration-300 ease-in-out",
          !mounted && slideFrom === "right" && "translate-x-full",
          !mounted && slideFrom === "left" && "-translate-x-full",
          mounted && !isClosing && "translate-x-0",
          isClosing && slideFrom === "right" && "translate-x-full",
          isClosing && slideFrom === "left" && "-translate-x-full",
          "shadow-lg", // Added shadow to make sidebar stand out without backdrop
          className
        )}
      >
        <div className="relative flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <BrandLogo />
          </div>
          <button
            onClick={closeSidebar}
            className="absolute right-4 p-2 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div
          className={cn(
            "flex-1 overflow-y-auto px-4 pb-4",
            "transition-opacity duration-300 ease-in-out",
            showSidebar ? "opacity-100" : "opacity-0"
          )}
        >
          {children}
        </div>
      </div>
    </Dialog>
  )
}

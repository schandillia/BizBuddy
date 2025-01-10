"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { cn } from "@/utils"
import {
  Gem,
  Key,
  LucideIcon,
  Menu,
  WandSparkles,
  RadioTower,
  Receipt,
  Shield,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { PropsWithChildren, useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import ThemeToggle from "@/components/theme/theme-toggle"
import { usePathname } from "next/navigation"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface SidebarItem {
  href: string
  icon: LucideIcon
  text: string
}

interface SidebarType {
  type: string
  items: SidebarItem[]
}

const SIDEBAR_ITEMS: SidebarType[] = [
  {
    type: "Account",
    items: [
      { href: "/settings/profile", icon: User, text: "Profile" },
      { href: "/settings/appearance", icon: Shield, text: "Security" },
    ],
  },
  {
    type: "Preferences",
    items: [
      { href: "/settings/appearance", icon: WandSparkles, text: "Appearance" },
    ],
  },
  {
    type: "System",
    items: [
      { href: "/settings/channels", icon: RadioTower, text: "Channels" },
      { href: "/settings/api-key", icon: Key, text: "API Key" },
    ],
  },
  {
    type: "Subscription",
    items: [
      {
        href: "/settings/subscription",
        icon: Receipt,
        text: "Billing",
      },
      {
        href: "/settings/subscription",
        icon: Gem,
        text: "Subscription",
      },
    ],
  },
]

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname()

  return (
    <div className="space-y-4 md:space-y-6 relative z-20 flex flex-col h-full">
      {/* logo */}
      <Link href="/" className="hidden sm:block text-lg/7 font-semibold">
        <BrandLogo />
      </Link>

      {/* navigation items */}
      <div className="flex-grow">
        <ul>
          {SIDEBAR_ITEMS.map(({ type, items }) => (
            <li key={type} className="mb-4 md:mb-8">
              <p className="text-xs font-medium leading-6 text-zinc-500 dark:text-zinc-400">
                {type}
              </p>
              <div className="-mx-2 flex flex-1 flex-col">
                {items.map((item, i) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6",
                        isActive
                          ? "bg-gray-50 dark:bg-brand-900 text-brand-900 dark:text-brand-200"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-brand-900 transition"
                      )}
                      onClick={onClose}
                    >
                      <item.icon
                        className={cn(
                          "size-4",
                          isActive
                            ? "text-brand-900 dark:text-brand-200"
                            : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                        )}
                      />
                      {item.text}
                    </Link>
                  )
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <hr className="my-4 md:my-6 w-full h-px bg-gray-100 dark:bg-brand-700 dark:border-brand-950" />
        <div className="flex justify-between items-center pr-6">
          <Button className="flex-row-reverse dark:text-gray-400">user</Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

const Layout = ({ children }: PropsWithChildren) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="relative h-screen flex flex-col md:flex-row bg-white dark:bg-brand-900/75 overflow-hidden">
      {/* sidebar for desktop */}
      <div className="hidden md:block w-64 lg:w-80 border-r border-gray-100 dark:border-brand-900 p-6 pr-0 h-full text-brand-900 relative z-10">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="text-lg/7 font-semibold">
            <BrandLogo />
          </Link>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400"
          >
            <Menu className="size-6" />
          </button>
        </div>

        {/* main content area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black shadow-md p-4 md:p-6 relative z-10">
          <div className="relative min-h-full flex flex-col">
            <div className="h-full flex flex-col flex-1 space-y-4">
              {children}
            </div>
          </div>
        </div>

        <Modal
          className="p-4"
          showModal={isDrawerOpen}
          setShowModal={setIsDrawerOpen}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg/7 font-semibold text-brand-900">
              <BrandLogo />
            </div>
            <button
              aria-label="Close modal"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="size-6" />
            </button>
          </div>

          <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
          <DialogDescription className="sr-only">
            Navigation menu for mobile devices
          </DialogDescription>

          <Sidebar onClose={() => setIsDrawerOpen(false)} />
        </Modal>
      </div>
    </div>
  )
}

export default Layout

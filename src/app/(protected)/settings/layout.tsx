"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"
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
} from "lucide-react"
import Link from "next/link"
import { PropsWithChildren, useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import ThemeToggle from "@/components/theme/theme-toggle"
import { usePathname } from "next/navigation"
import { DashboardNavButton } from "@/components/dashboard-nav-button"
import SidebarContent from "@/app/(protected)/settings/sidebar-content"

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

const Layout = ({ children }: PropsWithChildren) => {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="relative h-screen flex flex-col md:flex-row bg-white dark:bg-brand-900/75">
      {/* sidebar for desktop */}
      <div className="hidden md:block w-64 lg:w-80 border-r border-gray-100 dark:border-brand-900 py-6">
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-brand-800">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(true)}
              className="text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 cursor-pointer"
            >
              <Menu className="size-6" />
            </button>
            <Link href="/" className="text-lg/7 font-semibold ml-4">
              <BrandLogo />
            </Link>
          </div>
          <DashboardNavButton />
        </div>

        {/* main content area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black shadow-md p-4 md:p-6 relative z-10">
          <div className="relative min-h-full flex flex-col">
            <div className="h-full flex flex-col flex-1 space-y-4">
              {children}
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {showSidebar && (
          <Sidebar
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            slideFrom="left"
            className="block md:hidden"
            width="w-80"
          >
            {/* Add a wrapper div inside the Sidebar */}
            <div className="flex flex-col h-full py-4">
              <SidebarContent onClose={() => setShowSidebar(false)} />
            </div>
          </Sidebar>
        )}
      </div>
    </div>
  )
}

export default Layout

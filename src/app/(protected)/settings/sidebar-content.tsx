import { Button } from "@/components/ui/button"
import { cn } from "@/utils"
import {
  Gem,
  Key,
  LucideIcon,
  WandSparkles,
  RadioTower,
  Receipt,
  Shield,
  User,
} from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import ThemeToggle from "@/components/theme/theme-toggle"
import { usePathname } from "next/navigation"

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

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-full">
      {/* logo section - only show in desktop */}
      <Link
        href="/"
        className="hidden lg:block text-lg/7 font-semibold mb-6 ml-6"
      >
        <BrandLogo />
      </Link>

      {/* navigation section */}
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {SIDEBAR_ITEMS.map(({ type, items }) => (
            <li key={type} className="mb-4 md:mb-8">
              <p className="text-xs font-medium leading-6 text-zinc-500 dark:text-zinc-400 ml-6">
                {type}
              </p>
              <div className="flex flex-1 flex-col">
                {items.map((item, i) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      className={cn(
                        "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-6 py-1.5 text-sm font-medium leading-6 cursor-pointer",
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
      </nav>

      {/* footer section */}
      <div className="mt-auto pt-4 shrink-0">
        <hr className="mb-4 w-full h-px bg-gray-100 dark:bg-brand-700 dark:border-brand-950" />
        <div className="flex justify-between items-center pr-4 ml-4">
          <Button className="flex-row-reverse dark:text-gray-400">user</Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default SidebarContent

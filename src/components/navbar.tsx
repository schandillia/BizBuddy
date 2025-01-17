import Link from "next/link"
import { MaxWidthWrapper } from "@/components//max-width-wrapper"
import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/auth"
import { BrandLogo } from "@/components/brand-logo"
import { DashboardNavButton } from "@/components/dashboard-nav-button"
import UserNavMenu from "@/components/user-nav-menu"
import { AuthButton } from "@/components/auth/auth-button"

export const Navbar = async () => {
  const session = await auth()

  const guestLinks: {
    href: string
    label: string
    variant:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
  }[] = [{ href: "/pricing", label: "Pricing", variant: "ghost" }]

  return (
    <nav className="sticky z-10 h-16 inset-x-0 top-0 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-brand-900/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            <BrandLogo />
          </Link>

          <div className="h-full flex items-center space-x-4">
            {session?.user ? (
              <>
                <DashboardNavButton />
                <UserNavMenu user={session.user} />
              </>
            ) : (
              <>
                {guestLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${buttonVariants({
                      size: "sm",
                      variant: link.variant,
                    })} dark:text-brand-50`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-8 w-px bg-gray-200" />
                <AuthButton />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

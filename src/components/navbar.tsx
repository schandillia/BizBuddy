import Link from "next/link"
import { MaxWidthWrapper } from "./max-width-wrapper"
import { buttonVariants } from "@/components/ui/button"
import { currentUser } from "@clerk/nextjs/server"
import { BrandLogo } from "@/components/brand-logo"
import { UserButton } from "@clerk/nextjs"

export const Navbar = async () => {
  const user = await currentUser()

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
  }[] = [
    { href: "/pricing", label: "Pricing", variant: "ghost" },
    { href: "/sign-in", label: "Sign in", variant: "ghost" },
  ]

  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-brand-900/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            <BrandLogo />
          </Link>

          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1 mr-4",
                  })}
                >
                  Dashboard
                </Link>
                <UserButton />
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

                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1.5",
                  })}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

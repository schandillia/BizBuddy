import Link from "next/link"
import { MaxWidthWrapper } from "./max-width-wrapper"
import { buttonVariants } from "@/components/ui/button"
import { currentUser } from "@clerk/nextjs/server"
import { BrandLogo } from "@/components/brand-logo"
import { UserButton } from "@clerk/nextjs"
import ThemeToggle from "@/components/theme/theme-toggle"

export const Navbar = async () => {
  const user = await currentUser()

  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-brand-950/70 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            <BrandLogo />
          </Link>

          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>
                {/* <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Sign out
                  </Button>
                </SignOutButton> */}

                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1 mr-4",
                  })}
                >
                  Dashboard
                </Link>
                <ThemeToggle />
                <UserButton />
              </>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign in
                </Link>

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

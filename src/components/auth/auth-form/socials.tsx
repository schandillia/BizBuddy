// @/components/auth/auth-form/socials.tsx
"use client"

import { Button } from "@/components/ui/button"
import DividerWithText from "@/components/divider-with-text"
import { FcGoogle } from "react-icons/fc"
import { signInWithGoogle } from "@/app/actions/auth"
import { usePathname, useSearchParams } from "next/navigation"

export const Socials = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")

  // If the user is on the homepage ('/'), redirect to '/dashboard'
  const finalCallbackUrl = pathname === "/" ? "/dashboard" : pathname

  // Append 'intent' to the URL if it exists
  const redirectUrl = intent
    ? `${finalCallbackUrl}?intent=${intent}`
    : finalCallbackUrl

  const handleSignIn = () => {
    console.log("Redirecting to:", redirectUrl) // Debug: Check the URL
    signInWithGoogle(redirectUrl)
  }

  return (
    <div className="w-full space-y-3">
      <DividerWithText text="OR CONTINUE WITH" />
      <div className="flex flex-row gap-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center py-5 gap-2 hover:bg-gray-50 transition-colors"
          onClick={handleSignIn} // Pass the redirectUrl
        >
          <FcGoogle className="size-5" />
          <span className="text-sm font-medium">Google</span>
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center py-5 gap-2 hover:bg-gray-50 transition-colors"
          onClick={handleSignIn} // Pass the redirectUrl
        >
          <FcGoogle className="size-5" />
          <span className="text-sm font-medium">Google</span>
        </Button>
      </div>
    </div>
  )
}

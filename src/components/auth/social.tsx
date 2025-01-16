"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { useSearchParams, usePathname } from "next/navigation"

export const Social = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname() // More reliable than window.location.pathname
  const intent = searchParams.get("intent")

  // If the user is on the homepage ('/'), set the callbackUrl to '/dashboard'
  const finalCallbackUrl = pathname === "/" ? "/dashboard" : pathname

  // Append `intent` if it exists
  const redirectUrl = intent
    ? `${finalCallbackUrl}?intent=${intent}`
    : finalCallbackUrl

  console.log({ redirectUrl })

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: redirectUrl,
    })
  }

  return (
    <div className="flex items-centergap-x-2 w-full mt-4">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="size-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <FaGithub className="size-5" />
      </Button>
    </div>
  )
}

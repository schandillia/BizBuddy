"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export const Social = () => {
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: intent ? `/dashboard?intent=${intent}` : "/dashboard",
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

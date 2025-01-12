"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

const SignInPage = () => {
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: intent ? `/dashboard?intent=${intent}` : "/dashboard",
    })
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
    </div>
  )
}

export default SignInPage

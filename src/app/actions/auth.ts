// @/app/actions/auth.ts
"use server"

import { signIn } from "@/auth"
import { signOut } from "@/auth"
import { publicRoutes } from "@/routes"

// Pass callbackUrl in the correct object format
export async function signInWithGoogle(callbackUrl?: string) {
  await signIn("google", {
    redirectTo: callbackUrl || "/",
  })
}

export async function logOut(currentPath: string) {
  const isPublicRoute = publicRoutes.includes(currentPath)
  await signOut({
    redirectTo: isPublicRoute ? currentPath : "/auth/login",
  })
}

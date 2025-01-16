// Importing necessary modules from Next.js and NextAuth
import { NextResponse } from "next/server" // For returning responses in middleware
import NextAuth from "next-auth" // For using authentication features in Next.js
import authConfig from "@/auth.config" // Importing authentication configuration
import {
  DEFAULT_LOGIN_REDIRECT, // Default redirect URL after login
  apiRoutes, // Prefix used for API routes
  authRoutes, // Routes that facilitate authentication
  publicRoutes, // Routes that are public and do not require authentication
} from "@/routes" // Importing various route configurations

// Initializing NextAuth with the provided configuration
const { auth } = NextAuth(authConfig)

// Middleware function that processes requests before they reach the route handler
export default auth((req) => {
  const { nextUrl } = req // Destructuring the nextUrl from the request object
  const isLoggedIn = !!req.auth // Checking if the user is logged in (authenticated)

  // Checking if the requested route is an API route
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiRoutes)

  // Checking if the requested route is a public route (does not require authentication)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // Checking if the requested route requires authentication (protected route)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  // If the route is an API authentication route, allow the request to pass
  if (isApiAuthRoute) return NextResponse.next()

  // If the route is an authentication route, check if the user is logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      // If logged in, redirect to the default login redirect route (home or dashboard)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    // If not logged in, continue with the request as the user needs to log in
    return NextResponse.next()
  }

  // If the user is not logged in and the route is not public, redirect to the login page
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname // Storing the current path in a variable
    if (nextUrl.search) {
      // If there are query parameters, append them to the callback URL
      callbackUrl += nextUrl.search
    }
    // Encoding the callback URL to safely pass it in the URL
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    // Redirect to the login page with the callback URL as a query parameter
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  // If none of the above conditions matched, continue with the request
  return NextResponse.next()
})

// Configuration for which paths the middleware should run on
export const config = {
  // Match all paths except static files (like images, CSS, etc.) and Next.js internal routes
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

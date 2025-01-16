/**
 * An array of routes accessible to guest users
 * These routes do not require authentication
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/pricing",
  "/terms",
  "/privacy",
  "/about",
]

/**
 * An array of routes used for authentication
 * These routes redirect logged users to /settings
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
]

/**
 * The prefix for API authentication routes
 * These routes will never be blocked
 */
export const apiRoutes = "/api/"

/**
 * The default rediect path after sign-in
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

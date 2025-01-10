import { db } from "@/prisma"
import { j } from "./__internals/j"
import { HTTPException } from "hono/http-exception"
import { auth } from "@/auth"

const authMiddleware = j.middleware(async ({ c, next }) => {
  // Check for API key in Authorization header
  const authHeader = c.req.header("Authorization")
  if (authHeader) {
    const apiKey = authHeader.split(" ")[1] // bearer <API_KEY>
    const user = await db.user.findUnique({
      where: { apiKey },
    })
    if (user) return next({ user })
  }

  // If no API key, check for session
  const session = await auth()
  if (!session?.user?.id) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  return next({ user })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
export const privateProcedure = publicProcedure.use(authMiddleware)

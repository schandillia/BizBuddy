// src/server/routers/auth-router.ts
import { db } from "@/prisma"
import { auth } from "@/auth"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c, ctx }) => {
    const session = await auth()

    if (!session?.user) {
      return c.json({ isSynced: false, userExists: false })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return c.json({ isSynced: false, userExists: false })
    }

    return c.json({ isSynced: true, userExists: true })
  }),

  createUser: publicProcedure.mutation(async ({ c, ctx }) => {
    const session = await auth()

    if (!session?.user || !session.user.email) {
      throw new Error("Unauthorized or missing email")
    }

    const userData = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? "",
      image: session.user.image ?? "",
      emailVerified: (session.user as any).emailVerified ?? null,
      quotaLimit: 100,
    }

    const user = await db.user.create({
      data: userData,
    })

    return c.json({ success: true, user })
  }),
})

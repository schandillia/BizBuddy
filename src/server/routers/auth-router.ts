import { db } from "@/prisma"
import { auth } from "@/auth"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"

export const dynamic = "force-dynamic"

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c, ctx }) => {
    const session = await auth()

    if (!session?.user) {
      return c.json({ isSynced: false })
    }

    const user = await db.user.findFirst({
      where: { id: session.user.id },
    })

    console.log("USER IN DB:", user)

    if (!user) {
      const email = session.user.email ?? "" // Ensure email is a non-null string
      if (!email) {
        return c.json({ isSynced: false, message: "Email is required" })
      }

      const userData = {
        quotaLimit: 100,
        id: session.user.id,
        email: email,
        name: session.user.name ?? "",
        image: session.user.image ?? "",
        // Type-cast to handle the case where emailVerified is part of session.user
        emailVerified:
          (session.user as { emailVerified?: Date }).emailVerified ?? null,
      }

      await db.user.create({
        data: userData,
      })
    }

    return c.json({ isSynced: true })
  }),
})

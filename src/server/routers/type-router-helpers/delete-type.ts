import { db } from "@/prisma"
import { privateProcedure } from "../../procedures"
import { z } from "zod"

export const deleteType = privateProcedure
  .input(z.object({ slug: z.string() }))
  .mutation(async ({ c, input, ctx }) => {
    const { slug } = input

    await db.eventType.delete({
      where: { slug_userId: { slug, userId: ctx.user.id } },
    })

    return c.json({ success: true })
  })

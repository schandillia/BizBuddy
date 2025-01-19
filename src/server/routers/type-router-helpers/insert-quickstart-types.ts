import { db } from "@/prisma"
import { privateProcedure } from "../../procedures"

export const insertQuickstartTypes = privateProcedure.mutation(
  async ({ ctx, c }) => {
    const types = await db.eventType.createMany({
      data: [
        { name: "Sale", slug: "sale", emoji: "💰", color: 0xffeb3b },
        { name: "Sign-Up", slug: "sign-up", emoji: "🧑", color: 0x6c5ce7 },
        { name: "Bug", slug: "bug", emoji: "🐞", color: 0xff6b6b },
      ].map((type) => ({
        ...type,
        userId: ctx.user.id,
      })),
    })

    return c.json({ success: true, count: types.count })
  }
)

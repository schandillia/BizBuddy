import { addMonths, startOfMonth } from "date-fns"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { db } from "@/db"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { z } from "zod"

export const projectRouter = router({
  getUsage: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx

    const currentDate = startOfMonth(new Date())

    const quota = await db.quota.findFirst({
      where: {
        userId: user.id,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      },
    })

    const eventCount = quota?.count ?? 0

    const typeCount = await db.eventType.count({
      where: { userId: user.id },
    })

    const limits = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA

    const resetDate = addMonths(currentDate, 1)

    return c.superjson({
      typesUsed: typeCount,
      typesLimit: limits.maxEventTypes,
      eventsUsed: eventCount,
      eventsLimit: limits.maxEventsPerMonth,
      resetDate,
    })
  }),

  setDiscordID: privateProcedure
    .input(z.object({ discordId: z.string().max(20) }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { discordId } = input

      await db.user.update({
        where: { id: user.id },
        data: { discordId },
      })

      return c.json({ success: true })
    }),

  setWebexID: privateProcedure
    .input(z.object({ webexId: z.string().max(20) }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { webexId } = input

      await db.user.update({
        where: { id: user.id },
        data: { webexId },
      })

      return c.json({ success: true })
    }),

  setWhatsappID: privateProcedure
    .input(z.object({ whatsappId: z.string().max(20) }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { whatsappId } = input

      await db.user.update({
        where: { id: user.id },
        data: { whatsappId },
      })

      return c.json({ success: true })
    }),

  setSlackID: privateProcedure
    .input(z.object({ slackId: z.string().max(20) }))
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { slackId } = input

      await db.user.update({
        where: { id: user.id },
        data: { slackId },
      })

      return c.json({ success: true })
    }),

  setPreferredTheme: privateProcedure
    .input(
      z.object({
        theme: z.enum(["LIGHT", "DARK", "SYSTEM"]),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { theme } = input

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { theme },
        select: { theme: true },
      })

      return c.json({
        success: true,
        theme: updatedUser.theme,
      })
    }),
})

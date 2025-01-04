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

  setIntegrationIDs: privateProcedure
    .input(
      z.object({
        discordId: z.string().max(20),
        discordEnabled: z.boolean(),
        webexId: z.string().max(20),
        webexEnabled: z.boolean(),
        whatsappId: z.string().max(20),
        whatsappEnabled: z.boolean(),
        slackId: z.string().max(20),
        slackEnabled: z.boolean(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const {
        discordId,
        discordEnabled,
        webexId,
        webexEnabled,
        whatsappId,
        whatsappEnabled,
        slackId,
        slackEnabled,
      } = input

      await db.user.update({
        where: { id: user.id },
        data: {
          discordId,
          discordEnabled,
          webexId,
          webexEnabled,
          whatsappId,
          whatsappEnabled,
          slackId,
          slackEnabled,
        },
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

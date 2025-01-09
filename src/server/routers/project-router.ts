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

  setChannel: privateProcedure
    .input(
      z.object({
        activeChannel: z.enum([
          "DISCORD",
          "EMAIL",
          "WEBEX",
          "WHATSAPP",
          "SLACK",
          "TEAMS",
          "NONE",
        ]),
        discordId: z.string().max(20).optional(), // Discord uses snowflake IDs, always 17-19 digits
        emailId: z.string().max(254).optional(), // Max email length per RFC 5321
        webexId: z.string().max(100).optional(), // WebEx uses emails or room IDs
        whatsappId: z.string().max(50).optional(), // WhatsApp numbers with country code
        slackId: z.string().max(20).optional(), // Slack user IDs are usually 9-11 chars
        teamsId: z.string().max(100).optional(), // Teams uses UPNs or chat IDs
      })
    )
    .mutation(async ({ ctx, input, c }) => {
      const { user } = ctx

      await db.user.update({
        where: { id: user.id },
        data: {
          activeChannel: input.activeChannel,
          discordId: input.discordId?.trim() || null,
          emailId: input.emailId?.trim() || null,
          webexId: input.webexId?.trim() || null,
          whatsappId: input.whatsappId?.trim() || null,
          slackId: input.slackId?.trim() || null,
          teamsId: input.teamsId?.trim() || null,
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

  setPreferredFontSize: privateProcedure
    .input(
      z.object({
        fontSize: z.number().min(12).max(18).step(2),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { fontSize } = input

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { fontSize },
        select: { fontSize: true },
      })

      return c.json({
        success: true,
        fontSize: updatedUser.fontSize,
      })
    }),
})

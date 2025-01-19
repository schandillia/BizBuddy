import { db } from "@/prisma"
import { privateProcedure } from "../../procedures"
import { startOfMonth } from "date-fns"
import { EventType } from "./interfaces"

export const getEventTypes = privateProcedure.query(async ({ c, ctx }) => {
  const now = new Date()
  const firstDayOfMonth = startOfMonth(now)

  const types = await db.eventType.findMany({
    where: { userId: ctx.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      emoji: true,
      color: true,
      updatedAt: true,
      createdAt: true,
      events: {
        where: { createdAt: { gte: firstDayOfMonth } },
        select: {
          fields: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          events: {
            where: { createdAt: { gte: firstDayOfMonth } },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  const typesWithCounts = types.map((type: EventType) => {
    const uniqueFieldNames = new Set<string>()
    let lastPing: Date | null = null

    type.events.forEach((event) => {
      Object.keys(event.fields as object).forEach((fieldName) => {
        uniqueFieldNames.add(fieldName)
      })
      if (!lastPing || event.createdAt > lastPing) {
        lastPing = event.createdAt
      }
    })

    return {
      id: type.id,
      name: type.name,
      slug: type.slug,
      emoji: type.emoji,
      color: type.color,
      updatedAt: type.updatedAt,
      createdAt: type.createdAt,
      uniqueFieldCount: uniqueFieldNames.size,
      eventsCount: type._count.events,
      lastPing,
    }
  })

  return c.superjson({ types: typesWithCounts })
})

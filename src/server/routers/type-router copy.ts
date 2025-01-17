//src/server/routers/type-router.ts

import { db } from "@/prisma"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns"
import { z } from "zod"
import { TYPE_NAME_VALIDATOR } from "@/lib/validators/type-validator"
import { parseColor } from "@/utils"
import { HTTPException } from "hono/http-exception"
import { Prisma } from "@prisma/client"

// First, let's define interfaces for our types
interface EventType {
  id: string
  name: string
  slug: string
  emoji: string | null
  color: number
  updatedAt: Date
  createdAt: Date
  events: {
    fields: Prisma.JsonValue
    createdAt: Date
  }[]
  _count: {
    events: number
  }
}

interface Event {
  fields: Prisma.JsonValue
}

export const typeRouter = router({
  getEventTypes: privateProcedure.query(async ({ c, ctx }) => {
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
  }),

  deleteType: privateProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      const { slug } = input

      await db.eventType.delete({
        where: { slug_userId: { slug, userId: ctx.user.id } },
      })

      return c.json({ success: true })
    }),

  createEventType: privateProcedure
    .input(
      z.object({
        name: TYPE_NAME_VALIDATOR,
        color: z
          .string()
          .min(1, "Color is required")
          .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
        emoji: z.string().emoji("Invalid emoji").optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { color, name, emoji } = input

      // Check if the event type with the same name already exists for the current user
      const existingEventType = await db.eventType.findUnique({
        where: {
          name_userId: {
            name: name.toLowerCase(),
            userId: user.id,
          },
        },
      })

      if (existingEventType) {
        throw new HTTPException(400, {
          message: `Event type with name "${name}" already exists.`,
        })
      }

      // Proceed to create the new event type if no conflict
      const EventType = await db.eventType.create({
        data: {
          name: name,
          slug: name.toLowerCase().toLowerCase().replace(/\s+/g, "-"),
          color: parseColor(color),
          emoji,
          userId: user.id,
        },
      })

      return c.json({ EventType })
    }),

  insertQuickstartTypes: privateProcedure.mutation(async ({ ctx, c }) => {
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
  }),

  pollType: privateProcedure
    .input(z.object({ name: TYPE_NAME_VALIDATOR }))
    .query(async ({ c, ctx, input }) => {
      const { name } = input

      const type = await db.eventType.findUnique({
        where: { name_userId: { name, userId: ctx.user.id } },
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
      })

      if (!type) {
        throw new HTTPException(404, {
          message: `Type "${name}" not found`,
        })
      }

      const hasEvents = type._count.events > 0

      return c.json({ hasEvents })
    }),

  getEventsByTypeName: privateProcedure
    .input(
      z.object({
        name: TYPE_NAME_VALIDATOR,
        page: z.number(),
        limit: z.number().max(50),
        timeRange: z.enum(["today", "week", "month", "year", "custom"]),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { name, page, limit, timeRange, startDate, endDate } = input

      const now = new Date()
      let startDateFilter: Date

      if (timeRange === "custom" && startDate && endDate) {
        startDateFilter = new Date(startDate)
        const endDateFilter = new Date(endDate)

        const [events, eventsCount, uniqueFieldCount] = await Promise.all([
          db.event.findMany({
            where: {
              EventType: { name, userId: ctx.user.id },
              createdAt: {
                gte: startDateFilter,
                lte: endDateFilter,
              },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
          }),
          db.event.count({
            where: {
              EventType: { name, userId: ctx.user.id },
              createdAt: {
                gte: startDateFilter,
                lte: endDateFilter,
              },
            },
          }),
          db.event
            .findMany({
              where: {
                EventType: { name, userId: ctx.user.id },
                createdAt: {
                  gte: startDateFilter,
                  lte: endDateFilter,
                },
              },
              select: {
                fields: true,
              },
              distinct: ["fields"],
            })
            .then((events: Event[]) => {
              const fieldNames = new Set<string>()
              events.forEach((event) => {
                Object.keys(event.fields as object).forEach((fieldName) => {
                  fieldNames.add(fieldName)
                })
              })
              return fieldNames.size
            }),
        ])

        return c.superjson({
          events,
          eventsCount,
          uniqueFieldCount,
        })
      }

      switch (timeRange) {
        case "today":
          startDateFilter = startOfDay(now)
          break
        case "week":
          startDateFilter = startOfWeek(now, { weekStartsOn: 0 })
          break
        case "month":
          startDateFilter = startOfMonth(now)
          break
        case "year":
          startDateFilter = startOfYear(now)
          break
        default:
          startDateFilter = startOfDay(now)
      }

      const [events, eventsCount, uniqueFieldCount] = await Promise.all([
        db.event.findMany({
          where: {
            EventType: { name, userId: ctx.user.id },
            createdAt: { gte: startDate },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        db.event.count({
          where: {
            EventType: { name, userId: ctx.user.id },
            createdAt: { gte: startDate },
          },
        }),
        db.event
          .findMany({
            where: {
              EventType: { name, userId: ctx.user.id },
              createdAt: { gte: startDate },
            },
            select: {
              fields: true,
            },
            distinct: ["fields"],
          })
          .then((events: Event[]) => {
            const fieldNames = new Set<string>()
            events.forEach((event) => {
              Object.keys(event.fields as object).forEach((fieldName) => {
                fieldNames.add(fieldName)
              })
            })
            return fieldNames.size
          }),
      ])

      return c.superjson({
        events,
        eventsCount,
        uniqueFieldCount,
      })
    }),
})

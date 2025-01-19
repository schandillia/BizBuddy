import { db } from "@/prisma"
import { privateProcedure } from "../../procedures"
import { z } from "zod"
import { TYPE_NAME_VALIDATOR } from "@/lib/validators/type-validator"
import { startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns"
import { Event } from "./interfaces"

export const getEventsByTypeName = privateProcedure
  .input(
    z.object({
      name: TYPE_NAME_VALIDATOR,
      page: z.number(),
      limit: z.number().max(50),
      timeRange: z.enum(["today", "week", "month", "year", "custom"]),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    })
  )
  .query(async ({ c, ctx, input }) => {
    const { name, page, limit, timeRange, from, to } = input

    const now = new Date()
    let startDate: Date

    if (timeRange === "custom" && from && to) {
      startDate = new Date(from)
      const endDate = new Date(new Date(to).setDate(new Date(to).getDate() + 1))

      const [events, eventsCount, uniqueFieldCount] = await Promise.all([
        db.event.findMany({
          where: {
            EventType: { name, userId: ctx.user.id },
            createdAt: {
              gte: startDate,
              lte: endDate,
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
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        db.event
          .findMany({
            where: {
              EventType: { name, userId: ctx.user.id },
              createdAt: {
                gte: startDate,
                lte: endDate,
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
        startDate = startOfDay(now)
        break
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 0 })
        break
      case "month":
        startDate = startOfMonth(now)
        break
      case "year":
        startDate = startOfYear(now)
        break
      default:
        startDate = startOfDay(now)
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
  })

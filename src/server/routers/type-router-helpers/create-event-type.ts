import { db } from "@/prisma"
import { privateProcedure } from "../../procedures"
import { z } from "zod"
import { TYPE_NAME_VALIDATOR } from "@/lib/validators/type-validator"
import { parseColor } from "@/utils"
import { HTTPException } from "hono/http-exception"

export const createEventType = privateProcedure
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
  })

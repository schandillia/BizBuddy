import { db } from "@/prisma"
import { privateProcedure } from "../../procedures"
import { z } from "zod"
import { TYPE_NAME_VALIDATOR } from "@/lib/validators/type-validator"
import { HTTPException } from "hono/http-exception"

export const pollType = privateProcedure
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
  })

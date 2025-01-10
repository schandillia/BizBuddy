import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { db } from "@/prisma"
import { sendToDiscord } from "@/lib/api/channels/discord"
import { sendToSlack } from "@/lib/api/channels/slack"
import { sendToTeams } from "@/lib/api/channels/teams"
import { sendToWebex } from "@/lib/api/channels/webex"
import { TYPE_NAME_VALIDATOR } from "@/lib/validators/type-validator"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcrypt"

const hasNestedObjects = (obj: Record<string, any>): boolean => {
  return Object.values(obj).some(
    (value) =>
      typeof value === "object" && value !== null && !Array.isArray(value)
  )
}

const REQUEST_VALIDATOR = z
  .object({
    type: TYPE_NAME_VALIDATOR,
    fields: z.record(z.any()).optional(),
    description: z.string().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.fields && hasNestedObjects(data.fields)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nested objects not supported",
        path: ["fields"],
      })
    }
  })

type ChannelResult = {
  success: boolean
  message?: string
}

const validateChannelConfig = (
  user: any,
  channel: string
): { isValid: boolean; message?: string } => {
  switch (channel) {
    case "DISCORD":
      if (!user.discordId) {
        return {
          isValid: false,
          message: "Please enter your Discord ID in your account settings",
        }
      }
      break
    case "WEBEX":
      if (!user.webexId) {
        return {
          isValid: false,
          message: "Please enter your Webex ID in your account settings",
        }
      }
      break
    case "WHATSAPP":
      if (!user.whatsappId) {
        return {
          isValid: false,
          message: "Please enter your WhatsApp number in your account settings",
        }
      }
      break
    case "NONE":
      return {
        isValid: false,
        message: "Please activate a channel in your account settings",
      }
    default:
      return { isValid: true }
  }
  return { isValid: true }
}

const sendEventToChannel = async (
  channel: string,
  user: any,
  eventData: any
): Promise<ChannelResult> => {
  switch (channel) {
    case "DISCORD":
      return await sendToDiscord({
        discordId: user.discordId,
        eventData,
        discordBotToken: process.env.DISCORD_BOT_TOKEN as string,
      })
    case "WEBEX":
      return await sendToWebex({
        webexId: user.webexId,
        eventData,
        webexBotToken: process.env.WEBEX_BOT_TOKEN as string,
      })
    case "SLACK":
      return await sendToSlack({
        slackId: user.slackId,
        eventData,
      })
    case "TEAMS":
      return await sendToTeams({
        teamsId: user.teamsId,
        eventData,
      })
    default:
      return { success: false, message: `Unsupported channel: ${channel}` }
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Invalid or missing Authorization header" },
        { status: 401 }
      )
    }

    const apiKey = authHeader.split(" ")[1]
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 })
    }

    const users = await db.user.findMany({ include: { EventTypes: true } })

    let user = null
    for (const potentialUser of users) {
      const isMatch = await bcrypt.compare(apiKey, potentialUser.apiKey)
      if (isMatch) {
        user = potentialUser
        break
      }
    }

    if (!user) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 })
    }

    if (user.activeChannel === "NONE") {
      return NextResponse.json(
        { message: "Activate a provider in your account's channels section." },
        { status: 403 }
      )
    }

    const channelValidation = validateChannelConfig(user, user.activeChannel)
    if (!channelValidation.isValid) {
      return NextResponse.json(
        { message: channelValidation.message },
        { status: 403 }
      )
    }

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const quota = await db.quota.findUnique({
      where: { userId: user.id, month: currentMonth, year: currentYear },
    })

    const quotaLimit =
      user.plan === "FREE"
        ? FREE_QUOTA.maxEventsPerMonth
        : PRO_QUOTA.maxEventsPerMonth

    if (quota && quota.count >= quotaLimit) {
      return NextResponse.json(
        {
          message:
            "Monthly quota reached. Please upgrade your plan for more events.",
        },
        { status: 429 }
      )
    }

    let requestData: unknown
    try {
      requestData = await req.json()
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body" },
        { status: 400 }
      )
    }

    const validationResult = REQUEST_VALIDATOR.safeParse(requestData)

    if (!validationResult.success) {
      const eventId =
        requestData &&
        typeof requestData === "object" &&
        "eventId" in requestData
          ? (requestData as { eventId?: string }).eventId
          : undefined

      // Extract the first error message
      const errorMessage =
        validationResult.error.errors[0]?.message || "Validation failed"

      return NextResponse.json(
        {
          message: errorMessage,
          ...(eventId && { eventId }),
        },
        { status: 422 }
      )
    }

    const type = user.EventTypes.find(
      (cat) => cat.name === validationResult.data.type
    )

    if (!type) {
      return NextResponse.json(
        {
          message: `You don't have a type named "${validationResult.data.type}"`,
        },
        { status: 404 }
      )
    }

    const eventData = {
      title: `${type.emoji || "🔔"} ${
        type.name.charAt(0).toUpperCase() + type.name.slice(1)
      }`,
      description:
        validationResult.data.description ||
        `A new ${type.name} event has occurred!`,
      color: type.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validationResult.data.fields || {}).map(
        ([key, value]) => ({
          name: key,
          value: String(value),
          inline: true,
        })
      ),
    }

    const event = await db.event.create({
      data: {
        name: type.name,
        formattedMessage: `${eventData.title}\n\n${eventData.description}`,
        userId: user.id,
        fields: validationResult.data.fields || {},
        EventTypeId: type.id,
      },
    })

    const channelResult = await sendEventToChannel(
      user.activeChannel,
      user,
      eventData
    )

    if (!channelResult.success) {
      await db.event.update({
        where: { id: event.id },
        data: { deliveryStatus: "FAILED" },
      })
      return NextResponse.json(
        { message: channelResult.message, eventId: event.id },
        { status: 500 }
      )
    }

    await db.event.update({
      where: { id: event.id },
      data: { deliveryStatus: "DELIVERED" },
    })

    await db.quota.upsert({
      where: { userId: user.id, month: currentMonth, year: currentYear },
      update: { count: { increment: 1 } },
      create: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
        count: 1,
      },
    })

    return NextResponse.json({
      message: "Event processed successfully",
      eventId: event.id,
    })
  } catch (err) {
    console.error(err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.message }, { status: 422 })
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

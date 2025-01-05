import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { db } from "@/db"
import { sendToDiscord } from "@/lib/api/integrations/discord"
import { sendToSlack } from "@/lib/api/integrations/slack"
import { sendToTeams } from "@/lib/api/integrations/teams"
import { sendToWebex } from "@/lib/api/integrations/webex"
import { sendToWhatsapp } from "@/lib/api/integrations/whatsapp"
import { TYPE_NAME_VALIDATOR } from "@/lib/validators/type-validator"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const REQUEST_VALIDATOR = z
  .object({
    type: TYPE_NAME_VALIDATOR,
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    description: z.string().optional(),
  })
  .strict()

type IntegrationResult = {
  success: boolean
  message?: string
}

// Helper function to validate integration-specific requirements
const validateIntegrationConfig = (
  user: any,
  integration: string
): { isValid: boolean; message?: string } => {
  switch (integration) {
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
        message: "Please activate an integration in your account settings",
      }
      break
  }
  return { isValid: true }
}

// Function to send event based on integration type
const sendEventToIntegration = async (
  integration: string,
  user: any,
  eventData: any
): Promise<IntegrationResult> => {
  switch (integration) {
    case "DISCORD":
      return await sendToDiscord({
        discordId: user.discordId,
        eventData,
        botToken: process.env.DISCORD_BOT_TOKEN as string,
      })
    case "WEBEX":
      return await sendToWebex({
        webexId: user.webexId,
        eventData,
      })
    case "WHATSAPP":
      return await sendToWhatsapp({
        whatsappId: user.whatsappId,
        eventData,
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
      return {
        success: false,
        message: `Unsupported integration: ${integration}`,
      }
  }
}

export const POST = async (req: NextRequest) => {
  try {
    // Authentication check section
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

    // User validation
    const user = await db.user.findUnique({
      where: { apiKey },
      include: { EventTypes: true },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 })
    }

    // Check activeIntegration
    if (user.activeIntegration === "NONE") {
      return NextResponse.json(
        {
          message:
            "Activate a provider in your account's integrations section.",
        },
        { status: 403 }
      )
    }

    // Validate integration-specific requirements
    const integrationValidation = validateIntegrationConfig(
      user,
      user.activeIntegration
    )
    if (!integrationValidation.isValid) {
      return NextResponse.json(
        { message: integrationValidation.message },
        { status: 403 }
      )
    }

    // Quota management
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

    // Request parsing and validation
    let requestData: unknown
    try {
      requestData = await req.json()
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body" },
        { status: 400 }
      )
    }

    const validationResult = REQUEST_VALIDATOR.parse(requestData)

    // Verify the event type
    const type = user.EventTypes.find(
      (cat) => cat.name === validationResult.type
    )

    if (!type) {
      return NextResponse.json(
        { message: `You don't have a type named "${validationResult.type}"` },
        { status: 404 }
      )
    }

    // Prepare event data
    const eventData = {
      title: `${type.emoji || "🔔"} ${
        type.name.charAt(0).toUpperCase() + type.name.slice(1)
      }`,
      description:
        validationResult.description ||
        `A new ${type.name} event has occurred!`,
      color: type.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validationResult.fields || {}).map(
        ([key, value]) => ({
          name: key,
          value: String(value),
          inline: true,
        })
      ),
    }

    // Create event record in database
    const event = await db.event.create({
      data: {
        name: type.name,
        formattedMessage: `${eventData.title}\n\n${eventData.description}`,
        userId: user.id,
        fields: validationResult.fields || {},
        EventTypeId: type.id,
      },
    })

    // Send event to appropriate integration
    const integrationResult = await sendEventToIntegration(
      user.activeIntegration,
      user,
      eventData
    )

    if (!integrationResult.success) {
      await db.event.update({
        where: { id: event.id },
        data: { deliveryStatus: "FAILED" },
      })

      return NextResponse.json(
        { message: integrationResult.message, eventId: event.id },
        { status: 500 }
      )
    }

    // Update event and quota
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

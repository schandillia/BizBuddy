// Import required dependencies and configurations
import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { db } from "@/db"
import { DiscordClient } from "@/lib/discord-client"
import { TYPE_NAME_VALIDATOR } from "@/lib/validators/type-validator"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Define the shape of valid requests using Zod schema
// This ensures that incoming requests match our expected format
const REQUEST_VALIDATOR = z
  .object({
    type: TYPE_NAME_VALIDATOR, // The event type (must match predefined types)
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(), // Optional key-value pairs
    description: z.string().optional(), // Optional event description
  })
  .strict() // Ensures no additional fields are present

// POST endpoint handler for processing events
export const POST = async (req: NextRequest) => {
  try {
    // Authentication check section
    // Verify that the request includes a valid Bearer token
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          message: "Invalid auth header format. Expected: 'Bearer [API_KEY]'",
        },
        { status: 401 }
      )
    }

    const apiKey = authHeader.split(" ")[1]

    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 })
    }

    // User validation section
    // Look up the user associated with the API key and their event types
    const user = await db.user.findUnique({
      where: { apiKey },
      include: { EventTypes: true },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 })
    }

    // Ensure user has connected their Discord account
    if (!user.discordId) {
      return NextResponse.json(
        {
          message: "Please enter your discord ID in your account settings",
        },
        { status: 403 }
      )
    }

    // Quota management section
    // Check if user has exceeded their monthly event quota
    const currentData = new Date()
    const currentMonth = currentData.getMonth() + 1
    const currentYear = currentData.getFullYear()

    // Find existing quota record for current month
    const quota = await db.quota.findUnique({
      where: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
    })

    // Determine quota limit based on user's plan
    const quotaLimit =
      user.plan === "FREE"
        ? FREE_QUOTA.maxEventsPerMonth
        : PRO_QUOTA.maxEventsPerMonth

    // Check if quota has been exceeded
    if (quota && quota.count >= quotaLimit) {
      return NextResponse.json(
        {
          message:
            "Monthly quota reached. Please upgrade your plan for more events",
        },
        { status: 429 }
      )
    }

    // Discord integration section
    // Initialize Discord client and create DM channel
    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)
    const dmChannel = await discord.createDM(user.discordId)

    // Request processing section
    // Parse and validate the incoming JSON request
    let requestData: unknown
    try {
      requestData = await req.json()
    } catch (err) {
      return NextResponse.json(
        {
          message: "Invalid JSON request body",
        },
        { status: 400 }
      )
    }

    const validationResult = REQUEST_VALIDATOR.parse(requestData)

    // Verify the event type exists for this user
    const type = user.EventTypes.find(
      (cat) => cat.name === validationResult.type
    )

    if (!type) {
      return NextResponse.json(
        {
          message: `You dont have a type named "${validationResult.type}"`,
        },
        { status: 404 }
      )
    }

    // Event preparation section
    // Format the event data for Discord embed message
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
        ([key, value]) => {
          return {
            name: key,
            value: String(value),
            inline: true,
          }
        }
      ),
    }

    // Database operations section
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

    try {
      // Attempt to send the event to Discord
      await discord.sendEmbed(dmChannel.id, eventData)

      // Update event status to delivered
      await db.event.update({
        where: { id: event.id },
        data: { deliveryStatus: "DELIVERED" },
      })

      // Update user's quota
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
    } catch (err) {
      // Handle Discord delivery failure
      await db.event.update({
        where: { id: event.id },
        data: { deliveryStatus: "FAILED" },
      })

      console.log(err)

      return NextResponse.json(
        {
          message: "Error processing event",
          eventId: event.id,
        },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      message: "Event processed successfully",
      eventId: event.id,
    })
  } catch (err) {
    // Global error handling section
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

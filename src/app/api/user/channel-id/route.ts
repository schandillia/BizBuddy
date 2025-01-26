import { auth } from "@/auth"
import { db } from "@/prisma"
import { type ServiceName } from "@/types"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { serviceName, value } = await req.json()

    // Update the appropriate field based on service name
    const updateData: Record<string, string> = {}
    switch (serviceName as ServiceName) {
      case "DISCORD":
        updateData.discordId = value
        break
      case "WEBEX":
        updateData.webexId = value
        break
      case "SLACK":
        updateData.slackId = value
        break
      case "EMAIL":
        updateData.emailId = value
        break
      default:
        return new NextResponse("Invalid service name", { status: 400 })
    }

    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return new NextResponse("Channel ID updated", { status: 200 })
  } catch (error) {
    console.error("Failed to update channel ID:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { serviceName } = await req.json()
    console.log("Deleting service:", serviceName)

    // Get current state
    const beforeUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        activeChannel: true,
        discordId: true,
        discordVerified: true,
      },
    })
    console.log("Before update:", beforeUser)

    // Prepare update data
    let updateData = {}

    if (serviceName === "DISCORD") {
      updateData = {
        discordId: null,
        discordVerified: null,
        activeChannel:
          beforeUser?.activeChannel === "DISCORD"
            ? "NONE"
            : beforeUser?.activeChannel,
      }
    } else if (serviceName === "WEBEX") {
      // ... other cases
    }

    console.log("Update data:", updateData)

    // Perform the update
    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    // Verify the update
    const afterUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        activeChannel: true,
        discordId: true,
        discordVerified: true,
      },
    })
    console.log("After update:", afterUser)

    return new NextResponse("Channel ID deleted", { status: 200 })
  } catch (error) {
    console.error("Failed to delete channel ID:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

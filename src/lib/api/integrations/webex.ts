import { WebexClient } from "@/lib/api/integrations/webex-client"

interface User {
  webexId: string
  // Add other relevant user properties if needed
}

interface ValidationResult {
  type: string
  description?: string
  fields?: Record<string, string>
}

export const sendToWebex = async (
  user: User,
  validationResult: ValidationResult
) => {
  try {
    // Ensure the token is a string
    const token = process.env.WEBEX_BOT_TOKEN
    if (!token) {
      throw new Error(
        "WEBEX_BOT_TOKEN is not set in the environment variables."
      )
    }

    const webex = new WebexClient(token)

    // Format event data for Webex
    const eventData = {
      title: validationResult.type,
      description: validationResult.description || "A new event occurred!",
      fields: validationResult.fields || {},
    }

    // Create a message body
    const messageBody = `
      **${eventData.title}**\n
      ${eventData.description}\n
      ${Object.entries(eventData.fields)
        .map(([key, value]) => `**${key}:** ${value}`)
        .join("\n")}
    `

    // Send message to Webex
    await webex.sendMessage(user.webexId, messageBody)

    return {
      success: true,
      message: "Message sent to Webex successfully.",
    }
  } catch (err) {
    console.error("Error sending message to Webex:", err)
    return {
      success: false,
      message: "Failed to send message to Webex.",
    }
  }
}

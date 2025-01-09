// src/lib/api/channels/webex.ts

interface WebexMessageResponse {
  success: boolean
  message: string
}

interface SendToWebexParams {
  eventData: {
    title: string
    description: string
    color?: number
    timestamp?: string
    fields?: { name: string; value: string; inline?: boolean }[]
  }
  webexId: string
  webexBotToken: string
}

export const sendToWebex = async ({
  eventData,
  webexId,
  webexBotToken,
}: SendToWebexParams): Promise<WebexMessageResponse> => {
  try {
    // Format the message content
    const messageContent = [
      `**${eventData.title}**`, // Title in bold
      eventData.description, // Description in italics
      "", // Empty line for spacing
    ]

    // Add formatted fields if they exist
    if (eventData.fields && eventData.fields.length > 0) {
      eventData.fields.forEach((field) => {
        messageContent.push(`**${field.name}**: ${field.value}`)
      })
    }

    const response = await fetch("https://webexapis.com/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${webexBotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toPersonEmail: webexId,
        markdown: messageContent.join("\n"),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      message: "Message delivered successfully",
    }
  } catch (error) {
    console.error("Webex Message Error:", error)
    return {
      success: false,
      message: "Failed to deliver the message to Webex",
    }
  }
}

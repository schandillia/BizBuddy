// src/lib/api/channels/webex.ts

interface WebexMessageResponse {
  success: boolean
  message: string
}

interface SendToWebexParams {
  eventData: any
  webexId: string
  webexBotToken: string
}

export async function sendToWebex({
  eventData,
  webexId,
  webexBotToken,
}: SendToWebexParams): Promise<WebexMessageResponse> {
  try {
    const response = await fetch("https://webexapis.com/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${webexBotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toPersonEmail: webexId,
        markdown: JSON.stringify(eventData),
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

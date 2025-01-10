interface WebexMessageResponse {
  success: boolean
  message: string
}

interface Field {
  name: string
  value: string
  inline?: boolean
}

interface EventData {
  title: string
  description: string
  color: number
  timestamp?: string
  fields?: Field[]
}

interface WebexPayload {
  webexId: string
  webexBotToken: string
  eventData: EventData
}

interface WebexResponse {
  success: boolean
  message: string
  error?: string
  details?: any
}

export const sendToWebex = async ({
  webexId,
  eventData,
  webexBotToken,
}: WebexPayload): Promise<WebexResponse> => {
  try {
    // Helper function to chunk array into pairs for 2-column layout
    const chunkIntoPairs = (arr: Field[]) => {
      const chunks = []
      for (let i = 0; i < arr.length; i += 2) {
        chunks.push(arr.slice(i, i + 2))
      }
      return chunks
    }

    // Construct the message payload with adaptive card format
    const messagePayload = {
      toPersonEmail: webexId,
      markdown: eventData.title, // Fallback text for notifications
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: {
            type: "AdaptiveCard",
            version: "1.0",
            body: [
              // Title and description section
              {
                type: "TextBlock",
                text: eventData.title,
                weight: "bolder",
                size: "medium",
                wrap: true,
              },
              {
                type: "TextBlock",
                text: eventData.description,
                wrap: true,
              },
              // Fields section with 2-column layout
              ...(eventData.fields?.length
                ? chunkIntoPairs(eventData.fields).map((fieldPair) => ({
                    type: "ColumnSet",
                    columns: fieldPair.map((field) => ({
                      type: "Column",
                      width: "stretch",
                      items: [
                        {
                          type: "TextBlock",
                          text: field.name,
                          weight: "bolder",
                          wrap: true,
                        },
                        {
                          type: "TextBlock",
                          text: field.value,
                          wrap: true,
                        },
                      ],
                    })),
                  }))
                : []),
            ],
            ...(eventData.color && {
              style: {
                backgroundColor: `#${eventData.color.toString(16)}`,
              },
            }),
          },
        },
      ],
    }

    const response = await fetch("https://webexapis.com/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${webexBotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    })

    if (!response.ok) {
      return {
        success: false,
        message: "Webex API returned error",
        error: `HTTP error! status: ${response.status}`,
        details: response,
      }
    }

    return {
      success: true,
      message: "Message sent to Webex successfully",
    }
  } catch (error) {
    console.error("Error sending message to Webex:", error)
    return {
      success: false,
      message: "Failed to send message to Webex",
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    }
  }
}

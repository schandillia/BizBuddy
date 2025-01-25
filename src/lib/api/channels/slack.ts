type SendToSlackParams = {
  slackId: string
  message?: string
  eventData?: {
    title: string
    description: string
    color?: number
    fields?: Array<{
      name: string
      value: string
      inline?: boolean
    }>
    timestamp?: string
  }
}

export const sendToSlack = async ({
  slackId,
  message,
  eventData,
}: SendToSlackParams) => {
  try {
    let payload: any

    if (eventData) {
      // Format event data into Slack blocks
      payload = {
        channel: slackId,
        text: eventData.title, // Fallback text
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${eventData.title}*\n${eventData.description}`,
            },
          },
          ...(eventData.fields?.length
            ? [
                {
                  type: "section",
                  fields: eventData.fields.map((field) => ({
                    type: "mrkdwn",
                    text: `*${field.name}*\n${field.value}`,
                  })),
                },
              ]
            : []),
        ],
        ...(eventData.color && {
          attachments: [{ color: `#${eventData.color.toString(16)}` }],
        }),
      }
    } else {
      // Simple message
      payload = {
        channel: slackId,
        text: message,
      }
    }

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Failed to send message to Slack")
    }

    const data = await response.json()
    if (!data.ok) {
      throw new Error(data.error || "Failed to send message to Slack")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending to Slack:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Add new function for OTP messages
export const sendSlackOTP = async (slackId: string, otp: string) => {
  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: slackId,
        text: `Your verification code is: ${otp}`,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send OTP to Slack")
    }

    const data = await response.json()
    if (!data.ok) {
      throw new Error(data.error || "Failed to send OTP to Slack")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending OTP to Slack:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

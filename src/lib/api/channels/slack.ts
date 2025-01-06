import { WebClient } from "@slack/web-api"
import type { ChatPostMessageResponse } from "@slack/web-api"

interface Field {
  name: string
  value: string
}

interface EventData {
  title: string
  description: string
  color?: string
  fields?: Field[]
}

interface SlackPayload {
  slackId: string
  eventData: EventData
}

interface SlackResponse {
  success: boolean
  message: string
  response?: ChatPostMessageResponse
  error?: string
  details?: any
}

if (!process.env.SLACK_BOT_TOKEN) {
  throw new Error("SLACK_BOT_TOKEN is not configured in environment variables")
}

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN)

export const sendToSlack = async ({
  slackId,
  eventData,
}: SlackPayload): Promise<SlackResponse> => {
  try {
    // For DMs, we need to open a conversation first
    let channelId = slackId
    if (slackId.startsWith("U")) {
      try {
        const conv = await slackClient.conversations.open({ users: slackId })
        if (!conv.ok || !conv.channel?.id) {
          return {
            success: false,
            message: "Failed to open DM conversation",
            error: "Could not get conversation ID",
            details: conv,
          }
        }
        channelId = conv.channel.id
      } catch (error) {
        console.error("Error opening conversation:", error)
        return {
          success: false,
          message: "Failed to open DM conversation",
          error: error instanceof Error ? error.message : "Unknown error",
          details: error,
        }
      }
    }

    // Construct the message payload
    const messagePayload = {
      channel: channelId,
      text: eventData.title, // Fallback text for notifications
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
        attachments: [
          {
            color: eventData.color,
          },
        ],
      }),
    }

    console.log(
      "Sending message with payload:",
      JSON.stringify(messagePayload, null, 2)
    )
    const response = await slackClient.chat.postMessage(messagePayload)
    console.log("Slack API response:", JSON.stringify(response, null, 2))

    if (!response.ok) {
      return {
        success: false,
        message: "Slack API returned error",
        error: response.error,
        details: response,
      }
    }

    return {
      success: true,
      message: "Message sent to Slack successfully",
      response,
    }
  } catch (error) {
    console.error("Error sending message to Slack:", error)
    return {
      success: false,
      message: "Failed to send message to Slack",
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    }
  }
}

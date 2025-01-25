type SendToSlackParams = {
  slackId: string
  message: string
}

export const sendToSlack = async ({ slackId, message }: SendToSlackParams) => {
  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: slackId,
        text: message,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send message to Slack")
    }

    const data = await response.json()
    if (!data.ok) {
      throw new Error(data.error || "Failed to send message to Slack")
    }

    return data
  } catch (error) {
    console.error("Error sending to Slack:", error)
    throw error
  }
}

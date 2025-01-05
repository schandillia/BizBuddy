type TeamsPayload = {
  teamsId: string
  eventData: any
}

export const sendToTeams = async ({ teamsId, eventData }: TeamsPayload) => {
  try {
    // Log the input parameters for debugging
    console.log("Sending to WhatsApp:", { teamsId, eventData })

    // Simulate WhatsApp API call or actual implementation here
    // For example:
    // const response = await someTeamsApiClient.sendMessage({
    //   recipientId: teamsId,
    //   message: eventData,
    // })

    // Returning a success response
    return {
      success: true,
      message: "Message sent to WhatsApp successfully.",
      details: { teamsId, eventData },
    }
  } catch (error) {
    console.error("Error sending to WhatsApp:", error)

    // Return an error response
    return {
      success: false,
      message: "Failed to send message to WhatsApp.",
      error,
    }
  }
}

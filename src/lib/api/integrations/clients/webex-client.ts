import axios from "axios"

export class WebexClient {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  // Function to send a message to a Webex room
  async sendMessage(roomId: string, message: string) {
    const url = "https://webexapis.com/v1/messages"

    const headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    }

    const payload = {
      roomId,
      text: message,
    }

    try {
      const response = await axios.post(url, payload, { headers })
      return response.data
    } catch (error) {
      console.error("Error sending message to Webex:", error)
      throw error
    }
  }
}

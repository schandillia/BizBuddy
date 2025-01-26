import { DiscordClient } from "@/lib/api/channels/clients/discord-client"
import { type ApiResponse } from "@/types"

export const sendToDiscord = async ({
  discordId,
  eventData,
  discordBotToken,
}: {
  discordId: string
  eventData: {
    title: string
    description: string
    color?: number
    timestamp?: string
    fields?: { name: string; value: string; inline?: boolean }[]
  }
  discordBotToken: string
}) => {
  try {
    const discord = new DiscordClient(discordBotToken)
    const dmChannel = await discord.createDM(discordId)
    await discord.sendEmbed(dmChannel.id, eventData)

    return { success: true, message: "Message delivered successfully" }
  } catch (error) {
    console.error("Discord Channel Error:", error)
    return {
      success: false,
      message: "Failed to deliver the message to Discord",
    }
  }
}

export async function sendDiscordOTP(
  discordId: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN as string)
    const dmChannel = await discord.createDM(discordId)
    await discord.sendEmbed(dmChannel.id, {
      title: "Verification Code",
      description: `Your verification code is: ${otp}\nThis code will expire in 10 minutes.`,
      color: 0x0000ff,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send Discord message:", error)
    return { success: false, message: "Failed to send verification code" }
  }
}

import { DiscordClient } from "@/lib/api/channels/clients/discord-client"

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
  console.log("eventData from discord.ts: ", eventData)
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

import { DiscordClient } from "@/lib/api/integrations/clients/discord-client"

export const sendToDiscord = async ({
  discordId,
  eventData,
  botToken,
}: {
  discordId: string
  eventData: {
    title: string
    description: string
    color?: number
    timestamp?: string
    fields?: { name: string; value: string; inline?: boolean }[]
  }
  botToken: string
}) => {
  try {
    const discord = new DiscordClient(botToken)
    const dmChannel = await discord.createDM(discordId)
    await discord.sendEmbed(dmChannel.id, eventData)

    return { success: true, message: "Message delivered successfully" }
  } catch (error) {
    console.error("Discord Integration Error:", error)
    return {
      success: false,
      message: "Failed to deliver the message to Discord",
    }
  }
}

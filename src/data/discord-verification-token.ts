import { db } from "@/prisma"

export const getDiscordVerificationTokenByDiscordId = async (
  discordId: string
) => {
  try {
    const verificationToken = await db.discordVerificationToken.findFirst({
      where: { discordId },
    })

    return verificationToken
  } catch {
    return null
  }
}

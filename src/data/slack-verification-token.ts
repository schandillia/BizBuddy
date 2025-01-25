import { db } from "@/prisma"

export const getSlackVerificationTokenByToken = async (token: string) => {
  try {
    const slackVerificationToken = await db.slackVerificationToken.findUnique({
      where: { token },
    })

    return slackVerificationToken
  } catch (error: any) {
    return null
  }
}

export const getSlackVerificationTokenBySlackId = async (slackId: string) => {
  try {
    const slackVerificationToken = await db.slackVerificationToken.findFirst({
      where: { slackId },
    })

    return slackVerificationToken
  } catch (error: any) {
    return null
  }
}

import { db } from "@/prisma"

export const getWebexVerificationTokenByToken = async (token: string) => {
  try {
    const webexVerificationToken = await db.webexVerificationToken.findUnique({
      where: { token },
    })

    return webexVerificationToken
  } catch (error: any) {
    return null
  }
}

export const getWebexVerificationTokenByWebexId = async (webexId: string) => {
  try {
    const webexVerificationToken = await db.webexVerificationToken.findFirst({
      where: { webexId },
    })

    return webexVerificationToken
  } catch (error: any) {
    return null
  }
}

import { getPasswordResetTokenByEmail } from "@/data/password-reset-token"
import { getVerificationTokenByEmail } from "@/data/verification-token"
import { db } from "@/prisma"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { getWebexVerificationTokenByWebexId } from "@/data/webex-verification-token"
import { getSlackVerificationTokenBySlackId } from "@/data/slack-verification-token"

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return twoFactorToken
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    })
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return verificationToken
}

export const generateWebexVerificationToken = async (webexId: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expires = new Date(Date.now() + 5 * 60 * 1000)
  const existingToken = await getWebexVerificationTokenByWebexId(webexId)
  if (existingToken)
    await db.webexVerificationToken.delete({ where: { id: existingToken.id } })
  return await db.webexVerificationToken.create({
    data: { webexId, token, expires },
  })
}

export const generateSlackVerificationToken = async (slackId: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expires = new Date(Date.now() + 5 * 60 * 1000)

  const existingToken = await getSlackVerificationTokenBySlackId(slackId)
  if (existingToken)
    await db.slackVerificationToken.delete({ where: { id: existingToken.id } })

  return await db.slackVerificationToken.create({
    data: { slackId, token, expires },
  })
}

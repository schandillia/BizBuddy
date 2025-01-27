"use server"

import { db } from "@/prisma"
import { getWebexVerificationTokenByToken } from "@/data/webex-verification-token"
import { getSlackVerificationTokenByToken } from "@/data/slack-verification-token"
import { sendToWebex } from "@/lib/api/channels/webex"
import { generateWebexVerificationToken } from "@/lib/tokens"
import { generateSlackVerificationToken } from "@/lib/tokens"
import { sendSlackOTP } from "@/lib/api/channels/slack"
import { type ServiceName, type ApiResponse } from "@/types"
import { generateDiscordVerificationToken } from "@/lib/tokens"
import { sendDiscordOTP } from "@/lib/api/channels/discord"
import { sendEmailIdOTP } from "@/lib/mail"
import { generateEmailIdVerificationToken } from "@/lib/tokens"

export async function sendChannelVerification(
  serviceName: Exclude<ServiceName, "NONE">,
  serviceId: string,
  code?: string,
  userId?: string
) {
  try {
    if (code) {
      // Verification phase
      let existingToken

      switch (serviceName) {
        case "DISCORD":
          existingToken = await db.discordVerificationToken.findUnique({
            where: { token: code },
          })
          break
        case "WEBEX":
          existingToken = await getWebexVerificationTokenByToken(code)
          break
        case "SLACK":
          existingToken = await getSlackVerificationTokenByToken(code)
          break
        case "EMAIL":
          existingToken = await db.emailIdVerificationToken.findUnique({
            where: { token: code },
          })
          break
      }

      if (!existingToken) {
        return { success: false, message: "Invalid verification code" }
      }

      if (existingToken.expires && existingToken.expires < new Date()) {
        return { success: false, message: "Verification code has expired" }
      }

      // Delete the used token
      switch (serviceName) {
        case "DISCORD":
          await db.discordVerificationToken.delete({
            where: { token: code },
          })
          break
        case "WEBEX":
          await db.webexVerificationToken.delete({
            where: { token: code },
          })
          break
        case "SLACK":
          await db.slackVerificationToken.delete({
            where: { token: code },
          })
          break
        case "EMAIL":
          await db.emailIdVerificationToken.delete({
            where: { token: code },
          })
          break
      }

      // Update user's verification status
      if (userId) {
        await db.user.update({
          where: { id: userId },
          data: {
            discordVerified: serviceName === "DISCORD" ? new Date() : undefined,
            webexVerified: serviceName === "WEBEX" ? new Date() : undefined,
            slackVerified: serviceName === "SLACK" ? new Date() : undefined,
            emailIdVerified: serviceName === "EMAIL" ? new Date() : undefined,
          },
        })
      }

      return { success: true }
    } else {
      // Initial verification phase - send code
      switch (serviceName) {
        case "DISCORD":
          const discordVerificationToken =
            await generateDiscordVerificationToken(serviceId)
          const discordResult = await sendDiscordOTP(
            serviceId,
            discordVerificationToken.token
          )
          break
        case "WEBEX":
          const webexVerificationToken = await generateWebexVerificationToken(
            serviceId
          )
          await sendToWebex({
            webexId: serviceId,
            eventData: {
              title: "Channel Verification",
              description: "Verification Code",
              color: 0x0000ff,
              fields: [
                {
                  name: "OTP",
                  value: webexVerificationToken.token,
                },
              ],
            },
            webexBotToken: process.env.WEBEX_BOT_TOKEN as string,
          })
          break
        case "SLACK":
          const slackVerificationToken = await generateSlackVerificationToken(
            serviceId
          )
          await sendSlackOTP(serviceId, slackVerificationToken.token)
          break
        case "EMAIL":
          const emailIdVerificationToken =
            await generateEmailIdVerificationToken(serviceId)
          const emailResult = await sendEmailIdOTP(
            serviceId,
            emailIdVerificationToken.token
          )
          break
      }

      return { success: true, message: "Verification code sent" }
    }
  } catch (error) {
    console.error("Verification error:", error)
    return { success: false, message: "Something went wrong" }
  }
}

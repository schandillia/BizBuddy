"use server"

import { db } from "@/prisma"
import { getWebexVerificationTokenByToken } from "@/data/webex-verification-token"
import { getSlackVerificationTokenByToken } from "@/data/slack-verification-token"
import { sendToWebex } from "@/lib/api/channels/webex"
import { generateWebexVerificationToken } from "@/lib/tokens"
import { generateSlackVerificationToken } from "@/lib/tokens"
import { sendToSlack } from "@/lib/api/channels/slack"

export const sendChannelVerification = async (
  serviceName: string,
  channelId: string,
  code?: string,
  userId?: string
) => {
  try {
    if (!code) {
      // Initial verification check for both Webex and Slack
      if (serviceName === "WEBEX" || serviceName === "SLACK") {
        const existingUser = await db.user.findUnique({
          where:
            serviceName === "WEBEX"
              ? { webexId: channelId }
              : { slackId: channelId },
        })

        if (existingUser) {
          return {
            success: false,
            message: `This ${serviceName} account is already verified with another user`,
          }
        }
      }

      // Handle initial verification for each service
      if (serviceName === "WEBEX") {
        const webexVerificationToken = await generateWebexVerificationToken(
          channelId
        )
        await sendToWebex({
          webexId: channelId,
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
        return { success: true, message: "Verification code sent" }
      } else if (serviceName === "SLACK") {
        const slackVerificationToken = await generateSlackVerificationToken(
          channelId
        )
        await sendToSlack({
          slackId: channelId,
          message: `Your verification code is: ${slackVerificationToken.token}`,
        })
        return { success: true, message: "Verification code sent" }
      }
    }

    // Code verification
    if (
      (serviceName === "WEBEX" || serviceName === "SLACK") &&
      code &&
      userId
    ) {
      // Find the verification token in the database
      const existingToken =
        serviceName === "WEBEX"
          ? await getWebexVerificationTokenByToken(code)
          : await getSlackVerificationTokenByToken(code)

      if (!existingToken) {
        return { success: false, message: "Invalid verification code" }
      }

      // Check if the token matches the ID
      const matchesId =
        serviceName === "WEBEX"
          ? "webexId" in existingToken && existingToken.webexId === channelId
          : "slackId" in existingToken && existingToken.slackId === channelId

      if (!matchesId) {
        return {
          success: false,
          message: `Verification code does not match the provided ${serviceName} ID`,
        }
      }

      // Check if the token is expired
      if (existingToken.expires && existingToken.expires < new Date()) {
        return { success: false, message: "Verification code has expired" }
      }

      // Update the user using their ID
      await db.user.update({
        where: { id: userId },
        data: {
          [`${serviceName.toLowerCase()}Id`]: channelId,
          [`${serviceName.toLowerCase()}Verified`]: new Date(),
        },
      })

      // Delete the used token
      if (serviceName === "WEBEX") {
        await db.webexVerificationToken.delete({
          where: { token: code },
        })
      } else {
        await db.slackVerificationToken.delete({
          where: { token: code },
        })
      }

      return {
        success: true,
        message: `${serviceName} channel verified successfully`,
      }
    }

    return { success: false, message: "Invalid service or missing code" }
  } catch (error) {
    console.error("[CHANNEL_VERIFICATION_ERROR]", error)
    return {
      success: false,
      message: "Something went wrong during verification",
    }
  }
}

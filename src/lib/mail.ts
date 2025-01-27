import { Resend } from "resend"
import brand from "@/lib/constants/brand.json"
import { type ApiResponse } from "@/types"

const baseUrl = brand.SITE
const resend = new Resend(process.env.RESEND_API_KEY)

type EmailTemplate = {
  to: string
  subject: string
  html: string
}

// Base email sender
async function sendEmail({
  to,
  subject,
  html,
}: EmailTemplate): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: brand.NOREPLY_EMAIL,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, message: "Failed to send email" }
  }
}

// Auth-related emails
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${baseUrl}/auth/new-verification?token=${token}`
  return sendEmail({
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${baseUrl}/auth/new-password?token=${token}`
  return sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  })
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
  return sendEmail({
    to: email,
    subject: "Your one time passcode",
    html: `<p>Your sign-in OTP is ${token}.</p>`,
  })
}

// Channel verification email
export async function sendEmailIdOTP(emailId: string, otp: string) {
  return sendEmail({
    to: emailId,
    subject: "Channel Verification Code",
    html: `<p>Your channel verification code is: ${otp}<br>This code will expire in 10 minutes.</p>`,
  })
}

// Notification email
export async function sendNotificationEmail({
  emailId,
  eventData,
}: {
  emailId: string
  eventData: {
    title?: string
    description?: string
    fields?: Array<{ name: string; value: string }>
  }
}) {
  // Format fields into HTML
  const fieldsHtml =
    eventData.fields
      ?.map(
        (field) => `
        <div style="margin: 10px 0;">
          <strong>${field.name}:</strong>
          <div>${field.value}</div>
        </div>
      `
      )
      .join("") || ""

  // Build email HTML
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      ${
        eventData.title
          ? `<h1 style="color: #333;">${eventData.title}</h1>`
          : ""
      }
      ${eventData.description ? `<p>${eventData.description}</p>` : ""}
      ${fieldsHtml}
    </div>
  `

  return sendEmail({
    to: emailId,
    subject: eventData.title || "New Notification",
    html,
  })
}

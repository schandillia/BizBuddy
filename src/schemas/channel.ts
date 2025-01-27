import * as z from "zod"

export const ChannelIdSchema = {
  DISCORD: z
    .string()
    .min(17)
    .max(20)
    .regex(/^\d+$/, "Discord ID must contain only numbers"),

  EMAIL: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email cannot exceed 254 characters"),

  WEBEX: z
    .string()
    .email("Please enter a valid Webex email")
    .max(100, "Webex ID cannot exceed 100 characters"),

  SLACK: z
    .string()
    .min(9)
    .max(11)
    .regex(/^[UW][A-Z0-9]{8,}$/, "Invalid Slack user ID format"),
}

export type ChannelIdValidation = {
  [K in keyof typeof ChannelIdSchema]: z.infer<(typeof ChannelIdSchema)[K]>
}

import * as z from "zod"

export const ChannelIdSchema = {
  DISCORD: z
    .string()
    .min(17, "Discord ID must be at least 17 characters")
    .max(20, "Discord ID cannot exceed 20 characters")
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
    .min(9, "Slack ID must be at least 9 characters")
    .max(11, "Slack ID cannot exceed 11 characters")
    .regex(
      /^[UW][A-Z0-9]{8,}$/,
      "Invalid Slack user ID format. Must start with U or W followed by 8+ alphanumeric characters"
    ),
}

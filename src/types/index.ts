import { type Plan, type Theme, type Channel } from "@prisma/client"

// Re-export prisma types
export type { Plan, Theme, Channel }

// Channel types
export type ServiceName = "DISCORD" | "EMAIL" | "WEBEX" | "SLACK" | "NONE"

export type ChannelIds = {
  [K in Exclude<ServiceName, "NONE">]: string
}

// Event types
export type EventData = {
  title: string
  description: string
  color?: number
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  timestamp?: string
}

// API Response types
export type ApiResponse = {
  success: boolean
  message?: string
}

export type VerificationResponse = ApiResponse & {
  user?: {
    id: string
    email: string
    // ... other user fields
  }
}

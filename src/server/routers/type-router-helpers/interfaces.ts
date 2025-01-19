import { Prisma } from "@prisma/client"

export interface EventType {
  id: string
  name: string
  slug: string
  emoji: string | null
  color: number
  updatedAt: Date
  createdAt: Date
  events: {
    fields: Prisma.JsonValue
    createdAt: Date
  }[]
  _count: {
    events: number
  }
}

export interface Event {
  fields: Prisma.JsonValue
}

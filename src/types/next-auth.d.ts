// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      quotaLimit?: number
    } & DefaultSession["user"]
  }

  interface User {
    quotaLimit?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string
    quotaLimit?: number
  }
}

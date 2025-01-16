import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"

import bcrypt from "bcryptjs"

import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "@/data/user"

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          quotaLimit: 100, // Set default quotaLimit
        }
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig

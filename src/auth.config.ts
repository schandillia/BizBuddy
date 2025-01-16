// src/auth.config.ts
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"
import {
  verifyPasswordHash,
  createPasswordHash,
  isLegacyHash,
} from "@/lib/password-hash"
import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "@/data/user"
import { db } from "@/prisma"

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
          quotaLimit: 100,
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

          const passwordValid = await verifyPasswordHash(
            password,
            user.password
          )

          if (passwordValid) {
            // If using old hash, upgrade to new hash format
            if (isLegacyHash(user.password)) {
              const newHash = await createPasswordHash(password)
              await db.user.update({
                where: { id: user.id },
                data: { password: newHash },
              })
            }
            return user
          }
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig

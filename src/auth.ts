import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db as prisma } from "@/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const prismaAdapter = PrismaAdapter(prisma)

// Schema for credentials validation
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Override the createUser function in the adapter
const customAdapter = {
  ...prismaAdapter,
  createUser: async (data: any) => {
    const userData = {
      ...data,
      quotaLimit: 100, // Add the required field
      plan: "FREE", // Using schema default but being explicit
    }

    return await prisma.user.create({
      data: userData,
    })
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: customAdapter,
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const validatedCredentials = credentialsSchema.parse(credentials)

          // Find user
          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email },
          })

          if (!user || !user.password) return null

          // Verify password
          const isValidPassword = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          )

          if (!isValidPassword) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/new-user",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
})

// Helper functions for auth actions
export async function signUpWithCredentials(
  email: string,
  password: string,
  name: string
) {
  try {
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        quotaLimit: 100,
        plan: "FREE",
      },
    })

    return { success: true, user }
  } catch (error) {
    return { success: false, error }
  }
}

export async function resetPassword(email: string) {
  // Implement password reset logic here
  // This would typically involve:
  // 1. Generate reset token
  // 2. Save token to database with expiry
  // 3. Send email with reset link
  // 4. Handle token verification and password update in a separate function
}

export type AuthError =
  | "CredentialsSignin"
  | "UserNotFound"
  | "InvalidPassword"
  | "EmailExists"

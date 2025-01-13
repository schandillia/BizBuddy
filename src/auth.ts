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
          const validatedCredentials = credentialsSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email },
          })

          // If no user OR invalid password, return the same generic message
          // This prevents user enumeration
          if (!user || !user.password) {
            throw new Error("InvalidCredentials")
          }

          const isValidPassword = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          )

          if (!isValidPassword) {
            throw new Error("InvalidCredentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error("InvalidCredentials")
          }
          throw new Error("InvalidCredentials")
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
    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }, // Only select id field for efficiency
    })

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists",
      }
    }

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
    console.error("SignUp error:", error)
    return {
      success: false,
      error: "Failed to create account. Please try again later.",
    }
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

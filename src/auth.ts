import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db as prisma } from "@/prisma"

const prismaAdapter = PrismaAdapter(prisma)

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
  providers: [Google],
})

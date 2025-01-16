// src/app/actions/register.ts
"use server"

import { RegisterSchema } from "@/schemas"
import * as z from "zod"
import { createPasswordHash } from "@/lib/password-hash"
import { db } from "@/prisma"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields." }
  }

  const { email, password, name } = validatedFields.data
  const hashedPassword = await createPasswordHash(password)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in use." }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      quotaLimit: 100,
    },
  })

  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: "Confirmation email sent." }
}

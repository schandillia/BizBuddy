// src/app/actions/new-password.ts
"use server"

import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/prisma"
import { NewPasswordSchema } from "@/schemas"
import { createPasswordHash } from "@/lib/password-hash"
import * as z from "zod"

export const NewPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) return { error: "Missing token" }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) return { error: "Invalid fields" }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) return { error: "Invalid token" }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) return { error: "Token has expired" }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) return { error: "Email not found" }

  const hashedPassword = await createPasswordHash(password)

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  })

  return { success: "Password updated" }
}

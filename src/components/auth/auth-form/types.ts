// @/components/auth/auth-form/types.ts
import { z } from "zod"
import { LoginSchema, RegisterSchema, ResetSchema } from "@/schemas"

export type FormState = "login" | "register" | "reset" | "2fa"

export type LoginValues = z.infer<typeof LoginSchema>
export type RegisterValues = z.infer<typeof RegisterSchema>
export type ResetValues = z.infer<typeof ResetSchema>

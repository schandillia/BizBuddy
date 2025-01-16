// app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import { signUpWithCredentials } from "@/auth"
import { z } from "zod"

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Received signup data:", {
      ...body,
      password: body.password ? "[REDACTED]" : undefined,
    })

    const validatedData = signUpSchema.parse(body)

    const result = await signUpWithCredentials(
      validatedData.email,
      validatedData.password,
      validatedData.name
    )

    if (!result.success) {
      // Check if the error is about existing email
      if (result.error?.includes("already exists")) {
        return NextResponse.json(
          { error: result.error },
          { status: 409 } // 409 Conflict is appropriate for duplicate resource
        )
      }

      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors)
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

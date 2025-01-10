import { db } from "@/db"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { apiKeyHint: true },
    })

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json({ apiKeyHint: user.apiKeyHint })
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch API key hint" },
      { status: 500 }
    )
  }
}

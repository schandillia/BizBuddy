import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const auth = await currentUser()
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { externalId: auth.id },
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

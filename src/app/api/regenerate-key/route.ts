import { db } from "@/db"
import { auth } from "@/auth"
import { generateApiKey } from "@/lib/api/api-key"

export async function POST() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { generatedKey, hashedKey } = await generateApiKey()

    await db.user.update({
      where: { id: session.user.id },
      data: { apiKey: hashedKey, apiKeyHint: generatedKey.slice(-6) },
    })

    return Response.json({ apiKey: generatedKey })
  } catch (error) {
    return Response.json({ error: "Failed to regenerate key" }, { status: 500 })
  }
}

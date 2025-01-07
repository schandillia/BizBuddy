// app/api/regenerate-key/route.ts
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { generateApiKey } from "@/lib/api/api-key"

export async function POST() {
  try {
    const auth = await currentUser()
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { generatedKey, hashedKey } = await generateApiKey()

    await db.user.update({
      where: { externalId: auth.id },
      data: { apiKey: hashedKey },
    })

    return Response.json({ apiKey: generatedKey })
  } catch (error) {
    return Response.json({ error: "Failed to regenerate key" }, { status: 500 })
  }
}

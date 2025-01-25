import { auth } from "@/auth"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { serviceName } = await req.json()
    const idField = `${serviceName.toLowerCase()}Id`
    const verifiedField = `${serviceName.toLowerCase()}Verified`

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { activeChannel: true },
    })

    await db.user.update({
      where: { id: session.user.id },
      data: {
        [idField]: null,
        [verifiedField]: null,
        activeChannel:
          user?.activeChannel === serviceName ? "NONE" : user?.activeChannel,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[CHANNEL_ID_ERROR]", error)
    return new NextResponse(
      `Internal Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    )
  }
}

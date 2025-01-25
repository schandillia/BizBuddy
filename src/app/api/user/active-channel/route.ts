import { auth } from "@/auth"
import { db } from "@/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { activeChannel } = await req.json()

    await db.user.update({
      where: { id: session.user.id },
      data: { activeChannel },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ACTIVE_CHANNEL_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

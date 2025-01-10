import { DashboardPage } from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { TypePageContent } from "./type-page-content"

interface PageProps {
  params: {
    slug: string | string[] | undefined
  }
}

const Page = async ({ params }: PageProps) => {
  if (typeof params.slug !== "string") return notFound()

  const auth = await currentUser()

  if (!auth) {
    return notFound()
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) return notFound()

  const type = await db.eventType.findUnique({
    where: {
      slug_userId: {
        slug: params.slug,
        userId: user.id,
      },
    },
    include: {
      _count: {
        select: {
          events: true,
        },
      },
    },
  })

  if (!type) return notFound()

  const hasEvents = type._count.events > 0

  return (
    <DashboardPage title={`${type.emoji} ${type.name} Events`}>
      <TypePageContent hasEvents={hasEvents} type={type} />
    </DashboardPage>
  )
}

export default Page

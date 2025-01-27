import { redirect } from "next/navigation"
import { UserPage } from "@/components/user-page"
import { db } from "@/prisma"
import { auth } from "@/auth"
import { ChannelsPageContent } from "./channels-page-content"

const Page = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      activeChannel: true,
      discordId: true,
      emailId: true,
      webexId: true,
      slackId: true,
      webexVerified: true,
      slackVerified: true,
      discordVerified: true,
      emailIdVerified: true,
    },
  })

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <UserPage title="Notification Channels">
      <ChannelsPageContent
        activeChannel={user.activeChannel}
        discordId={user.discordId ?? ""}
        emailId={user.emailId ?? ""}
        webexId={user.webexId ?? ""}
        slackId={user.slackId ?? ""}
        webexVerified={user.webexVerified}
        slackVerified={user.slackVerified}
        discordVerified={user.discordVerified}
        emailIdVerified={user.emailIdVerified}
      />
    </UserPage>
  )
}

export default Page

import { UserPage } from "@/components/user-page"
import { db } from "@/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ChannelsPageContent } from "@/app/(protected)/settings/channels/channels-page-content"

const Page = async () => {
  const session = await auth()

  if (!session) {
    redirect("/sign-in")
  }
  if (!session.user) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <UserPage title="Channels">
      <ChannelsPageContent
        activeChannel={user.activeChannel}
        discordId={user.discordId ?? ""}
        emailId={user.emailId ?? ""}
        webexId={user.webexId ?? ""}
        slackId={user.slackId ?? ""}
      />
    </UserPage>
  )
}

export default Page

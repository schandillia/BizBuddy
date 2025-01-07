import { UserPage } from "@/components/user-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ChannelsPageContent } from "@/app/settings/channels/channels-page-content"

const Page = async () => {
  const auth = await currentUser()

  if (!auth) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
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
        whatsappId={user.whatsappId ?? ""}
        slackId={user.slackId ?? ""}
        teamsId={user.teamsId ?? ""}
      />
    </UserPage>
  )
}

export default Page

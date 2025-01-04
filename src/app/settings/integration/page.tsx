import { UserPage } from "@/components/user-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { IntegrationPageContent } from "@/app/settings/integration/integration-page-content"

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
    <UserPage title="Integration">
      <IntegrationPageContent
        discordId={user.discordId ?? ""}
        discordEnabled={user.discordEnabled ?? ""}
        webexId={user.webexId ?? ""}
        webexEnabled={user.webexEnabled ?? ""}
        slackId={user.slackId ?? ""}
        slackEnabled={user.slackEnabled ?? ""}
        whatsappId={user.whatsappId ?? ""}
        whatsappEnabled={user.whatsappEnabled ?? ""}
      />
    </UserPage>
  )
}

export default Page

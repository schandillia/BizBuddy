import { DashboardPage } from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DiscordSettingsCard } from "@/app/dashboard/(settings)/account-settings/discord-settings-card"
import { AppearanceSettings } from "./appearance-settings"
import { WebexSettingsCard } from "./webex-settings-card"
import { WhatsappSettingsCard } from "./whatsapp-settings-card"
import { SlackSettingsCard } from "./slack-settings-card"

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
    <DashboardPage title="Account Settings">
      <AppearanceSettings preferredTheme={user.theme ?? ""} />
      <DiscordSettingsCard discordId={user.discordId ?? ""} />
      <WebexSettingsCard webexId={user.webexId ?? ""} />
      <WhatsappSettingsCard whatsappId={user.whatsappId ?? ""} />
      <SlackSettingsCard slackId={user.slackId ?? ""} />
    </DashboardPage>
  )
}

export default Page

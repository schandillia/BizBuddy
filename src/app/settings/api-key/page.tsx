import { DashboardPage } from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ApiKeyPageContent } from "@//app/settings/api-key/api-key-page-content"
import { UserPage } from "@/components/user-page"

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
    <UserPage title="API Key">
      <ApiKeyPageContent apiKey={user.apiKey ?? ""} />
    </UserPage>
  )
}

export default Page

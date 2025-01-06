import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UserPage } from "@/components/user-page"
import { ApiKeyWrapper } from "@/app/settings/api-key/api-key-wrapper"

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
      <ApiKeyWrapper initialApiKey={user.apiKey ?? ""} />
    </UserPage>
  )
}

export default Page

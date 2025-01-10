import { UserPage } from "@/components/user-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SubscriptionPageContent } from "@/app/settings/subscription/subscription-page-content"

const Page = async () => {
  const auth = await currentUser()

  if (!auth) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { id: auth.id },
  })

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <UserPage title="Subscription">
      <SubscriptionPageContent plan={user.plan} />
    </UserPage>
  )
}

export default Page

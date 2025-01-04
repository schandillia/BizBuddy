import { UserPage } from "@/components/user-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ProfilePageContent } from "@/app/settings/profile/profile-page-content"

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
    <UserPage title="Profile">
      <ProfilePageContent user={user} />
    </UserPage>
  )
}

export default Page

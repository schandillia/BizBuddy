import { UserPage } from "@/components/user-page"
import { db } from "@/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProfilePageContent } from "@/app/settings/profile/profile-page-content"

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
    <UserPage title="Profile">
      <ProfilePageContent user={user} />
    </UserPage>
  )
}

export default Page

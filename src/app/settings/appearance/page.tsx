import { UserPage } from "@/components/user-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AppearancePageContent } from "@/app/settings/appearance/appearance-page-content"

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
    <UserPage title="Appearance">
      <AppearancePageContent
        preferredTheme={user.theme}
        preferredFontSize={user.fontSize}
      />
    </UserPage>
  )
}

export default Page

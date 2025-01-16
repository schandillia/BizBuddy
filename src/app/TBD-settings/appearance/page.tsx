import { UserPage } from "@/components/user-page"
import { db } from "@/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AppearancePageContent } from "@/app/settings/appearance/appearance-page-content"

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
    <UserPage title="Appearance">
      <AppearancePageContent
        preferredTheme={user.theme}
        preferredFontSize={user.fontSize}
      />
    </UserPage>
  )
}

export default Page

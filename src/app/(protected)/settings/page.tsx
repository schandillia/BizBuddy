import { UserPage } from "@/components/user-page"
import { db } from "@/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { createCheckoutSession } from "@/lib/stripe"
import { PaymentSuccessModal } from "@/components/payment-success-modal"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
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
    return redirect("/welcome")
  }

  // Check if the user is on /settings with no sub-route, and redirect to /settings/profile
  if (!searchParams["intent"]) {
    redirect("/settings/profile")
  }

  const intent = searchParams.intent

  if (intent === "upgrade") {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    })

    if (session.url) redirect(session.url)
  }

  const success = searchParams.success

  return (
    <>
      {success ? <PaymentSuccessModal /> : null}

      <UserPage title="Profile">
        <p>settings home</p>
      </UserPage>
    </>
  )
}

export default Page

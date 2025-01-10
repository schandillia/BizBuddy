import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UserPage } from "@/components/user-page"
import { generateApiKey } from "@/lib/api/api-key"
import { ApiKeyPageContent } from "@/app/settings/api-key/api-key-page-content"

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

  let apiKey = user.apiKey ?? "" // Default to current user's API key if it exists

  if (!user.apiKey.startsWith("$")) {
    // Key is not encrypted
    // Generate custom key (pk_)
    // Encrypt it using bcrypt
    // Update encrypted key to user table
    // Send unencrypted key (pk_) to user
    const { generatedKey, hashedKey } = await generateApiKey()
    await db.user.update({
      where: { id: auth.id },
      data: { apiKey: hashedKey, apiKeyHint: generatedKey.slice(-6) },
    })
    apiKey = generatedKey // Set the unencrypted key for the user
  } else {
    // Set initialKey to the last 6 characters of the encrypted key followed by 4 asterisks
    apiKey = ""
  }

  return (
    <UserPage title="API Key">
      <ApiKeyPageContent apiKey={apiKey} />
    </UserPage>
  )
}

export default Page

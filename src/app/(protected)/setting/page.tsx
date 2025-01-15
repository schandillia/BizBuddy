import { auth } from "@/auth"

const Page = async () => {
  const session = await auth()

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
    </div>
  )
}
export default Page

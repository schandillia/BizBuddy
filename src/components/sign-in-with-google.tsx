import { signInWithGoogle } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export default function SignInWithGoogle() {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit">Sign In with Google</Button>
    </form>
  )
}

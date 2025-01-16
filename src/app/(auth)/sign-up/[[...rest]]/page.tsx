import { signInWithGoogle } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

const SignUpPage = () => {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <form action={signInWithGoogle}>
        <Button type="submit">Sign in with Google</Button>
      </form>
    </div>
  )
}

export default SignUpPage

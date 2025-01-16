// @/components/auth/auth-form/socials.tsx
import { Button } from "@/components/ui/button"
import DividerWithText from "@/components/divider-with-text"
import { FcGoogle } from "react-icons/fc"
import { signInWithGoogle } from "@/app/actions/auth"

export const Socials = () => (
  <div className="w-full space-y-3">
    <DividerWithText text="OR CONTINUE WITH" />
    <div className="flex flex-row gap-3">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center py-5 gap-2 hover:bg-gray-50 transition-colors"
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle className="size-5" />
        <span className="text-sm font-medium"></span>
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center py-5 gap-2 hover:bg-gray-50 transition-colors"
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle className="size-5" />
        <span className="text-sm font-medium"></span>
      </Button>
    </div>
  </div>
)

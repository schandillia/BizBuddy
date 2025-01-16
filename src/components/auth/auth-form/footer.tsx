// @/components/auth/auth-form/footer.tsx
import { Button } from "@/components/ui/button"
import { FormState } from "./types"

interface FooterProps {
  formState: FormState
  onStateChange: (state: FormState) => void
}

export const Footer = ({ formState, onStateChange }: FooterProps) => (
  <div className="text-center -mt-2">
    {formState === "reset" ? (
      <Button
        variant="link"
        className="font-normal text-sm"
        onClick={() => onStateChange("login")}
      >
        Back to login
      </Button>
    ) : (
      <Button
        variant="link"
        className="font-normal text-sm"
        onClick={() =>
          onStateChange(formState === "register" ? "login" : "register")
        }
      >
        {formState === "register"
          ? "Already have an account?"
          : "Don't have an account?"}
      </Button>
    )}
  </div>
)

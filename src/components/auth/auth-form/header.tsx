// @/components/auth/auth-form/header.tsx
import { Heading } from "@/components/heading"
import { FormState } from "./types"

interface HeaderProps {
  formState: FormState
}

export const Header = ({ formState }: HeaderProps) => (
  <div className="text-center space-y-1">
    <Heading as="h2" className="text-2xl font-bold tracking-tight">
      {formState === "register" && "Create Account"}
      {formState === "login" && "Welcome Back"}
      {formState === "reset" && "Reset Password"}
      {formState === "2fa" && "Two-Factor Authentication"}
    </Heading>
    <p className="text-sm text-gray-500">
      {formState === "register" && "Create your account to get started"}
      {formState === "login" && "Please enter your credentials to continue"}
      {formState === "reset" && "Enter your email to reset your password"}
      {formState === "2fa" && "Enter the code sent to your email"}
    </p>
  </div>
)

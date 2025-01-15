import { CardWrapper } from "@/components/auth/card-wrapper"
import { TriangleAlert } from "lucide-react"

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong."
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex items-center justify-center text-destructive">
        <TriangleAlert />
      </div>
    </CardWrapper>
  )
}

import { TriangleAlert } from "lucide-react"

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null
  return (
    <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm gap-x-2 items-center flex">
      <TriangleAlert className="size-4" />
      <p>{message}</p>
    </div>
  )
}

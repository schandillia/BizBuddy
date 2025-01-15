import { CircleCheck } from "lucide-react"

interface FormSuccessProps {
  message?: string
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null
  return (
    <div className="bg-emerald-500/15 text-emerald-500 rounded-md p-3 text-sm gap-x-2 items-center flex">
      <CircleCheck className="size-4" />
      <p>{message}</p>
    </div>
  )
}

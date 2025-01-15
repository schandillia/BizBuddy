import { cn } from "@/utils"

interface HeaderProps {
  title?: string
  label: string
  className?: string
}

export const Header = ({
  title = "Default Title",
  label,
  className,
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", className)}>{title}</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}

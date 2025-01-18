// (eventTable)/row-limit-input.tsx
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export const RowLimitInput = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const limit = parseInt(searchParams.get("limit") || "30", 10)
  const [limitInput, setLimitInput] = useState(limit.toString())

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLimitInput(value)

    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set("limit", numValue.toString())
      searchParams.set("page", "1")
      router.push(`?${searchParams.toString()}`, { scroll: false })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Rows per page:</span>
      <Input
        type="number"
        min="1"
        max="100"
        value={limitInput}
        onChange={handleLimitChange}
        className="w-20 dark:text-gray-300"
      />
    </div>
  )
}

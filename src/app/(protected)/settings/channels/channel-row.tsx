"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { type ServiceName } from "@/types"

type ChannelRowProps = {
  name: string
  displayName: string
  placeholder: string
  currentId: string
  hasValidId: boolean
  isVerified: boolean
  isActive: boolean
  isUpdating: boolean
  isPendingVerification: boolean
  onVerify: () => void
  onToggle: () => void
  onChange: (value: string) => void
}

export function ChannelRow({
  name,
  displayName,
  placeholder,
  currentId,
  hasValidId,
  isVerified,
  isActive,
  isUpdating,
  isPendingVerification,
  onVerify,
  onToggle,
  onChange,
}: ChannelRowProps) {
  return (
    <TableRow className="dark:hover:bg-brand-950/40">
      <TableCell className="font-medium">
        <div className="flex flex-row items-center gap-2 text-gray-600 dark:text-gray-300">
          {displayName}
        </div>
      </TableCell>
      <TableCell>
        {hasValidId &&
          (isVerified || name === "EMAIL" ? (
            <Switch
              checked={isActive}
              onCheckedChange={onToggle}
              disabled={isUpdating}
              className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onVerify}
              disabled={isPendingVerification}
            >
              {isPendingVerification ? (
                <>
                  Verifying
                  <Loader2 className="size-4 ml-2 animate-spin" />
                </>
              ) : (
                "Verify"
              )}
            </Button>
          ))}
      </TableCell>
      <TableCell className="text-right">
        <Input
          className="mt-1 dark:placeholder:text-gray-600"
          value={currentId}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </TableCell>
    </TableRow>
  )
}

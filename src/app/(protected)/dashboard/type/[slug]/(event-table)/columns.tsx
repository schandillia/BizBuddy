// (eventTable)/columns.tsx
import { Event } from "@prisma/client"
import { Column, Row, ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { cn } from "@/utils"

export const createColumns = (data: {
  events: Event[]
}): ColumnDef<Event>[] => [
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<Event, unknown> }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }: { row: Row<Event> }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })
    },
  },
  ...(data?.events[0]
    ? Object.keys(data.events[0].fields as object).map((field) => ({
        id: field,
        accessorFn: (row: Event) => (row.fields as Record<string, any>)[field],
        header: ({ column }: { column: Column<Event, unknown> }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {field}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }: { row: Row<Event> }) =>
          (row.original.fields as Record<string, any>)[field] || "-",
      }))
    : []),
  {
    id: "deliveryStatus",
    accessorKey: "deliveryStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Delivery Status
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span
        className={cn("px-2 py-1 rounded-full text-xs font-semibold", {
          "bg-green-100 text-green-800":
            row.getValue("deliveryStatus") === "DELIVERED",
          "bg-red-100 text-red-800":
            row.getValue("deliveryStatus") === "FAILED",
          "bg-yellow-100 text-yellow-800":
            row.getValue("deliveryStatus") === "PENDING",
        })}
      >
        {row.getValue("deliveryStatus")}
      </span>
    ),
  },
]

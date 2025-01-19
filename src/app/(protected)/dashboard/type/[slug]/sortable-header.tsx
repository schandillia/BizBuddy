import { Event } from "@prisma/client"
import { Column } from "@tanstack/react-table"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"

interface SortableHeaderProps {
  column: Column<Event>
  title: string
}

const SortableHeader = ({ column, title }: SortableHeaderProps) => {
  const sorted = column.getIsSorted()

  return (
    <div
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="flex items-center cursor-pointer hover:text-accent-foreground"
    >
      {title}
      {sorted === "asc" && <ChevronUp className="ml-2 size-4" />}
      {sorted === "desc" && <ChevronDown className="ml-2 size-4" />}
      {!sorted && <ChevronsUpDown className="ml-2 size-4" />}
    </div>
  )
}

export default SortableHeader

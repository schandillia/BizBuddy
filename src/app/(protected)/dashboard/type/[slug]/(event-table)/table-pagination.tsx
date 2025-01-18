// (eventTable)/table-pagination.tsx
import { Button } from "@/components/ui/button"
import { Table } from "@tanstack/react-table"
import { Event } from "@prisma/client"

interface TablePaginationProps {
  table: Table<Event>
  isFetching: boolean
}

export const TablePagination = ({
  table,
  isFetching,
}: TablePaginationProps) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage() || isFetching}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage() || isFetching}
      >
        Next
      </Button>
    </div>
  )
}

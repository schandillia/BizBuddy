// (eventTable)/event-table.tsx
"use client"

import { Card } from "@/components/ui/card"
import { Heading } from "@/components/heading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEventTable } from "@/app/(protected)/dashboard/type/[slug]/(event-table)/use-event-table"
import { flexRender } from "@tanstack/react-table"
import { TablePagination } from "@/app/(protected)/dashboard/type/[slug]/(event-table)/table-pagination"
import { RowLimitInput } from "@/app/(protected)/dashboard/type/[slug]/(event-table)/row-limit-input"

interface EventTableProps {
  typeName: string
}

export const EventTable = ({ typeName }: EventTableProps) => {
  const { table, columns, isFetching } = useEventTable({ typeName })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heading className="text-3xl">Event Overview</Heading>
          <RowLimitInput />
        </div>
      </div>

      <Card contentClassName="px-6 py-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isFetching ? (
              [...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <TablePagination table={table} isFetching={isFetching} />
    </div>
  )
}

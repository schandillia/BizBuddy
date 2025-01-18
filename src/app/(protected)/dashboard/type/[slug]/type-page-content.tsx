//src/app/(protected)/dashboard/type/[slug]/type-page-content.tsx

"use client"

import { Input } from "@/components/ui/input"
import { client } from "@/lib/client"
import { Event, EventType } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import {
  isAfter,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { ArrowUpDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { EmptyTypeState } from "@/app/(protected)/dashboard/type/[slug]/empty-type-state"
import { EventTable } from "@/app/(protected)/dashboard/type/[slug]/event-table"
import { NumericSummary } from "@/app/(protected)/dashboard/type/[slug]/numeric-summary"
import {
  type TimeRange,
  type DateRange,
} from "@/app/(protected)/dashboard/type/[slug]/types"
import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils"
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import Export from "@/app/(protected)/dashboard/type/[slug]/export"

interface TypePageContentProps {
  hasEvents: boolean
  type: EventType
}

export const TypePageContent = ({
  hasEvents: initialHasEvents,
  type,
}: TypePageContentProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TimeRange>("today")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "30", 10)
  const [limitInput, setLimitInput] = useState(limit.toString())

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  })

  const { data: pollingData } = useQuery({
    queryKey: ["type", type.name, "hasEvents"],
    initialData: { hasEvents: initialHasEvents },
  })

  const { data, isFetching } = useQuery({
    queryKey: [
      "events",
      type.name,
      pagination.pageIndex,
      pagination.pageSize,
      activeTab,
      dateRange.from,
      dateRange.to,
    ],
    queryFn: async () => {
      const params: any = {
        name: type.name,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        timeRange: activeTab,
      }

      if (activeTab === "custom" && dateRange.from && dateRange.to) {
        params.from = dateRange.from.toISOString()
        params.to = dateRange.to.toISOString()
      }

      const res = await client.type.getEventsByTypeName.$get(params)
      return await res.json()
    },
    refetchOnWindowFocus: false,
    enabled: pollingData.hasEvents,
  })

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLimitInput(value)

    // Only update if the value is a valid number and between 1 and 100
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set("limit", numValue.toString())
      searchParams.set("page", "1") // Reset to first page when changing limit
      router.push(`?${searchParams.toString()}`, { scroll: false })

      setPagination((prev) => ({
        pageIndex: 0, // Reset to first page
        pageSize: numValue,
      }))
    }
  }

  const columns: ColumnDef<Event>[] = useMemo(
    () => [
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
        cell: ({ row }) => {
          return new Date(row.getValue("createdAt")).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }
          )
        },
      },
      ...(data?.events[0]
        ? Object.keys(data.events[0].fields as object).map((field) => ({
            id: field,
            accessorFn: (row: Event) =>
              (row.fields as Record<string, any>)[field],
            header: ({ column }: { column: Column<Event, unknown> }) => (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
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
        header: ({ column }: { column: Column<Event, unknown> }) => (
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
    ],
    [data?.events]
  )

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: data?.events || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.eventsCount || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("page", (pagination.pageIndex + 1).toString())
    searchParams.set("limit", pagination.pageSize.toString())
    router.push(`?${searchParams.toString()}`, { scroll: false })
  }, [pagination, router])

  const numericFieldSums = useMemo(() => {
    if (!data?.events || data.events.length === 0) return {}

    const sums: Record<
      string,
      {
        total: number
        thisWeek: number
        thisMonth: number
        thisYear: number
        today: number
      }
    > = {}

    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 0 })
    const monthStart = startOfMonth(now)
    const yearStart = startOfYear(now)

    data.events.forEach((event) => {
      const eventDate = event.createdAt

      Object.entries(event.fields as object).forEach(([field, value]) => {
        if (typeof value === "number") {
          if (!sums[field]) {
            sums[field] = {
              total: 0,
              thisWeek: 0,
              thisMonth: 0,
              thisYear: 0,
              today: 0,
            }
          }

          sums[field].total += value

          if (
            isAfter(eventDate, weekStart) ||
            eventDate.getTime() === weekStart.getTime()
          ) {
            sums[field].thisWeek += value
          }

          if (
            isAfter(eventDate, monthStart) ||
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[field].thisMonth += value
          }

          if (
            isAfter(eventDate, yearStart) ||
            eventDate.getTime() === yearStart.getTime()
          ) {
            sums[field].thisYear += value
          }

          if (isToday(eventDate)) {
            sums[field].today += value
          }
        }
      })
    })

    return sums
  }, [data?.events])

  if (!pollingData.hasEvents) {
    return <EmptyTypeState typeName={type.name} />
  }

  return (
    <div className="relative z-0">
      <div className="space-y-6">
        <NumericSummary
          events={data?.events || []}
          eventsCount={data?.eventsCount || 0}
          activeTab={activeTab}
          onTabChange={(value: TimeRange, newDateRange?: DateRange) => {
            setActiveTab(value)
            if (newDateRange) {
              setDateRange(newDateRange)
            }
          }}
        />

        <div className="flex flex-col gap-4 relative z-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Heading className="text-3xl">Event Overview</Heading>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={limitInput}
                  onChange={handleLimitChange}
                  className="w-20 dark:text-gray-300"
                />
              </div>
              <Export />
            </div>
          </div>

          <EventTable table={table} columns={columns} isFetching={isFetching} />
        </div>

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
      </div>
    </div>
  )
}

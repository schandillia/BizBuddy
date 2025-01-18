//src/app/(protected)/dashboard/type/[slug]/type-page-content.tsx

"use client"

import { Event, EventType } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { client } from "@/lib/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChartNoAxesCombined } from "lucide-react"
import {
  isAfter,
  isToday,
  startOfYear,
  startOfMonth,
  startOfWeek,
} from "date-fns"

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils"
import { Heading } from "@/components/heading"
import { EmptyTypeState } from "@/app/(protected)/dashboard/type/[slug]/empty-type-state"
import { EventTable } from "@/app/(protected)/dashboard/type/[slug]/event-table"

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

  const [activeTab, setActiveTab] = useState<
    "today" | "week" | "month" | "year"
  >("today")

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
    ],
    queryFn: async () => {
      const res = await client.type.getEventsByTypeName.$get({
        name: type.name,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        timeRange: activeTab,
      })

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

          if (isToday(eventDate)) {
            sums[field].today += value
          }
        }
      })
    })

    return sums
  }, [data?.events])

  const NumericFieldSumCards = () => {
    if (Object.keys(numericFieldSums).length === 0) return null

    return Object.entries(numericFieldSums).map(([field, sums]) => {
      const relevantSum =
        activeTab === "today"
          ? sums.today
          : activeTab === "week"
          ? sums.thisWeek
          : sums.thisMonth

      return (
        <Card key={field}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">{field}</p>
            <ChartNoAxesCombined className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">{relevantSum.toFixed(0)}</p>
            <p className="text-xs/5 text-muted-foreground">
              {activeTab === "today"
                ? "today"
                : activeTab === "week"
                ? "this week"
                : activeTab === "month"
                ? "this month"
                : "this year"}
            </p>
          </div>
        </Card>
      )
    })
  }

  if (!pollingData.hasEvents) {
    return <EmptyTypeState typeName={type.name} />
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as "today" | "week" | "month" | "year")
        }}
      >
        <TabsList className="mb-2 text-gray-200 bg-brand-600 dark:bg-brand-900">
          <TabsTrigger
            value="today"
            className="data-[state=active]:bg-brand-200 data-[state=active]:text-brand-900"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="week"
            className="data-[state=active]:bg-brand-200 data-[state=active]:text-brand-900"
          >
            This Week
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="data-[state=active]:bg-brand-200 data-[state=active]:text-brand-900"
          >
            This Month
          </TabsTrigger>
          <TabsTrigger
            value="year"
            className="data-[state=active]:bg-brand-200 data-[state=active]:text-brand-900"
          >
            This Year
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <Card>
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Total Events</p>
                <ChartNoAxesCombined className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-2xl font-bold">{data?.eventsCount || 0}</p>
                <p className="text-xs/5 text-muted-foreground">
                  Events{" "}
                  {activeTab === "today"
                    ? "today"
                    : activeTab === "week"
                    ? "this week"
                    : activeTab === "month"
                    ? "this month"
                    : "this year"}
                </p>
              </div>
            </Card>

            <NumericFieldSumCards />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-4">
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
  )
}

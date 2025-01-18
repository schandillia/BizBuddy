// (eventTable)/use-event-table.ts
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table"
import { client } from "@/lib/client"
import { createColumns } from "./columns"
import { useTimeRange } from "@/app/(protected)/dashboard/type/[slug]/(time-range-tabs)/use-time-range"

interface UseEventTableProps {
  typeName: string
}

export const useEventTable = ({ typeName }: UseEventTableProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { activeTab } = useTimeRange()

  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "30", 10)

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { data, isFetching } = useQuery({
    queryKey: [
      "events",
      typeName,
      pagination.pageIndex,
      pagination.pageSize,
      activeTab,
    ],
    queryFn: async () => {
      const res = await client.type.getEventsByTypeName.$get({
        name: typeName,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        timeRange: activeTab,
      })
      return await res.json()
    },
    refetchOnWindowFocus: false,
  })

  const columns = createColumns(data || { events: [] })

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

  return {
    table,
    columns,
    isFetching,
  }
}

// (statistics)/use-numeric-sums.ts
import { useMemo } from "react"
import {
  isAfter,
  isToday,
  startOfYear,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Event } from "@prisma/client"
import { useTimeRange } from "@/app/(protected)/dashboard/type/[slug]/(time-range-tabs)/use-time-range"

interface NumericSums {
  total: number
  thisWeek: number
  thisMonth: number
  thisYear: number
  today: number
}

export const useNumericSums = (typeName: string) => {
  const { activeTab } = useTimeRange()

  const { data, isFetching } = useQuery({
    queryKey: ["events", typeName, activeTab],
    queryFn: async () => {
      const res = await client.type.getEventsByTypeName.$get({
        name: typeName,
        timeRange: activeTab,
        // Increase limit to ensure we get all events
        page: 1,
        limit: 10000, // Adjust this based on your expected maximum number of events
      })
      return (await res.json()) as { events: Event[]; eventsCount: number }
    },
    refetchOnWindowFocus: false,
  })

  const numericFieldSums = useMemo(() => {
    if (!data?.events || data.events.length === 0) return {}

    const sums: Record<string, NumericSums> = {}

    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 0 })
    const monthStart = startOfMonth(now)
    const yearStart = startOfYear(now)

    data.events.forEach((event) => {
      const eventDate = new Date(event.createdAt)

      Object.entries(event.fields as Record<string, any>).forEach(
        ([field, value]) => {
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

            // Add to total
            sums[field].total += value

            // Check week
            if (
              isAfter(eventDate, weekStart) ||
              eventDate.getTime() === weekStart.getTime()
            ) {
              sums[field].thisWeek += value
            }

            // Check month
            if (
              isAfter(eventDate, monthStart) ||
              eventDate.getTime() === monthStart.getTime()
            ) {
              sums[field].thisMonth += value
            }

            // Check year
            if (
              isAfter(eventDate, yearStart) ||
              eventDate.getTime() === yearStart.getTime()
            ) {
              sums[field].thisYear += value
            }

            // Check today
            if (isToday(eventDate)) {
              sums[field].today += value
            }
          }
        }
      )
    })

    return sums
  }, [data?.events])

  const getRelevantSum = (sums: NumericSums) => {
    switch (activeTab) {
      case "today":
        return sums.today
      case "week":
        return sums.thisWeek
      case "month":
        return sums.thisMonth
      case "year":
        return sums.thisYear
      default:
        return sums.total
    }
  }

  return {
    data,
    isFetching,
    activeTab,
    numericFieldSums,
    getRelevantSum,
  }
}

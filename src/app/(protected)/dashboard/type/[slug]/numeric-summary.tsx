// Numeric-summary.tsx
import { Event } from "@prisma/client"
import {
  isAfter,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { useMemo } from "react"
import { StatsTabs } from "@/app/(protected)/dashboard/type/[slug]/stats-tabs"
import {
  type TimeRange,
  type DateRange,
} from "@/app/(protected)/dashboard/type/[slug]/types"

interface NumericSummaryProps {
  events: Event[]
  eventsCount: number
  activeTab: TimeRange
  onTabChange: (value: TimeRange, dateRange?: DateRange) => void
}

export const NumericSummary = ({
  events,
  eventsCount,
  activeTab,
  onTabChange,
}: NumericSummaryProps) => {
  const numericFieldSums = useMemo(() => {
    if (!events || events.length === 0) return {}

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

    events.forEach((event) => {
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
  }, [events])

  return (
    <StatsTabs
      activeTab={activeTab}
      onTabChange={onTabChange}
      eventsCount={eventsCount}
      numericFieldSums={numericFieldSums}
    />
  )
}

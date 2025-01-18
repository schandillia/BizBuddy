export type TimeRange = "today" | "week" | "month" | "year" | "custom"

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

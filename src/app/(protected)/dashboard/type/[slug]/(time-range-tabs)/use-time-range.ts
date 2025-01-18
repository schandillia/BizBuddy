// (time-range-tabs)/use-time-range.ts
import { useState } from "react"

export const useTimeRange = () => {
  const [activeTab, setActiveTab] = useState<
    "today" | "week" | "month" | "year"
  >("today")

  return {
    activeTab,
    setActiveTab,
  }
}

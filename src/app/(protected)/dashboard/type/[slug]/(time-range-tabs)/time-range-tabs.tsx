// (time-range-tabs)/time-range-tabs.tsx
"use client"

import { useTimeRange } from "@/app/(protected)/dashboard/type/[slug]/(time-range-tabs)/use-time-range"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TimeRangeTabsProps {
  typeName: string
}

export const TimeRangeTabs = ({ typeName }: TimeRangeTabsProps) => {
  const { activeTab, setActiveTab } = useTimeRange()

  return (
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
      <TabsContent value={activeTab} />
    </Tabs>
  )
}

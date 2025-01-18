// @/app/(protected)/dashboard/type/[slug]/stats-tabs.tsx

import { NumericFieldSumCards } from "@/app/(protected)/dashboard/type/[slug]/numeric-field-sum-cards"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartNoAxesCombined } from "lucide-react"

export type TimeRange = "today" | "week" | "month" | "year"

interface StatsTabsProps {
  activeTab: TimeRange
  onTabChange: (value: TimeRange) => void
  eventsCount: number
  numericFieldSums: Record<
    string,
    {
      total: number
      thisWeek: number
      thisMonth: number
      thisYear: number
      today: number
    }
  >
}

export const StatsTabs = ({
  activeTab,
  onTabChange,
  eventsCount,
  numericFieldSums,
}: StatsTabsProps) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        onTabChange(value as TimeRange)
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
              <p className="text-2xl font-bold">{eventsCount || 0}</p>
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

          <NumericFieldSumCards
            numericFieldSums={numericFieldSums}
            activeTab={activeTab}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

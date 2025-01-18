import { NumericFieldSumCards } from "@/app/(protected)/dashboard/type/[slug]/numeric-field-sum-cards"
import {
  type TimeRange,
  type DateRange,
} from "@/app/(protected)/dashboard/type/[slug]/types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChartNoAxesCombined } from "lucide-react"
import { useState } from "react"

interface StatsTabsProps {
  activeTab: TimeRange
  onTabChange: (value: TimeRange, dateRange?: DateRange) => void
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
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  const handleTabChange = (value: TimeRange) => {
    if (value === "custom") {
      onTabChange(value, dateRange)
    } else {
      onTabChange(value)
    }
  }

  const handleDateSelect = (newDateRange: DateRange) => {
    setDateRange(newDateRange)
    if (newDateRange.from && newDateRange.to) {
      onTabChange("custom", newDateRange)
    }
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        handleTabChange(value as TimeRange)
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
        <TabsTrigger
          value="custom"
          className="data-[state=active]:bg-brand-200 data-[state=active]:text-brand-900"
        >
          Custom
        </TabsTrigger>
      </TabsList>

      {activeTab === "custom" && (
        <div className="flex gap-4 mb-4">
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dateRange.from ? (
                    format(dateRange.from, "PPP")
                  ) : (
                    <span>Pick a start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date: Date | undefined) =>
                    handleDateSelect({ ...dateRange, from: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dateRange.to ? (
                    format(dateRange.to, "PPP")
                  ) : (
                    <span>Pick an end date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date: Date | undefined) =>
                    handleDateSelect({ ...dateRange, to: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

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
                {activeTab === "custom"
                  ? "in selected range"
                  : activeTab === "today"
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

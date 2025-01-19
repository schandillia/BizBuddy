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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/utils"
import { format, isAfter, startOfTomorrow } from "date-fns"
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
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Function to check if a date is in the future
  const isDateDisabled = (date: Date) => {
    return isAfter(date, startOfTomorrow())
  }

  const handleTabChange = (value: TimeRange) => {
    if (value === "custom") {
      onTabChange(value, dateRange)
    } else {
      onTabChange(value)
    }
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    const newRange = { ...dateRange, from: date }
    setDateRange(newRange)
    setStartDateOpen(false)
    if (newRange.from && newRange.to) {
      onTabChange("custom", newRange)
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    const newRange = { ...dateRange, to: date }
    setDateRange(newRange)
    setEndDateOpen(false)
    if (newRange.from && newRange.to) {
      onTabChange("custom", newRange)
    }
  }

  // Mobile dropdown for time range selection
  const MobileTimeRangeSelect = () => (
    <Select
      value={activeTab}
      onValueChange={(value) => handleTabChange(value as TimeRange)}
    >
      <SelectTrigger className="w-full mb-4">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="year">This Year</SelectItem>
        <SelectItem value="custom">Custom Range</SelectItem>
      </SelectContent>
    </Select>
  )

  // Desktop tabs for time range selection
  const DesktopTabs = () => (
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
  )

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        handleTabChange(value as TimeRange)
      }}
    >
      <div className="md:hidden">
        <MobileTimeRangeSelect />
      </div>
      <div className="hidden md:block">
        <DesktopTabs />
      </div>

      {activeTab === "custom" && (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-x-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                From
              </span>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:w-auto justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {dateRange.from ? (
                      format(dateRange.from, "PP")
                    ) : (
                      <span>Pick a start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={handleStartDateSelect}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-x-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                To
              </span>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:w-auto justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {dateRange.to ? (
                      format(dateRange.to, "PP")
                    ) : (
                      <span>Pick an end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={handleEndDateSelect}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      <TabsContent value={activeTab}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <Card className="relative z-0">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm/6 font-medium">Events</p>
              <ChartNoAxesCombined className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-2xl font-bold">{eventsCount || 0}</p>
              <p className="text-xs/5 text-muted-foreground">
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

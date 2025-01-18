// (statistics)/statistics-cards.tsx
"use client"

import { Card } from "@/components/ui/card"
import { ChartNoAxesCombined } from "lucide-react"
import { NumericFieldSumCard } from "./numeric-field-sum-card"
import { useNumericSums } from "./use-numeric-sums"

interface StatisticsCardsProps {
  typeName: string
}

export const StatisticsCards = ({ typeName }: StatisticsCardsProps) => {
  const { data, activeTab, numericFieldSums } = useNumericSums(typeName)

  return (
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

      {Object.entries(numericFieldSums).map(([field, sums]) => (
        <NumericFieldSumCard
          key={field}
          field={field}
          sums={sums}
          activeTab={activeTab}
        />
      ))}
    </div>
  )
}

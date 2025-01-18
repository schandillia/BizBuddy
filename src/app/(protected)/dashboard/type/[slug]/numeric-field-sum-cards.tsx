// @/app/(protected)/dashboard/type/[slug]/numeric-field-sum-cards.tsx

import { type TimeRange } from "@/app/(protected)/dashboard/type/[slug]/types"
import { Card } from "@/components/ui/card"
import { ChartNoAxesCombined } from "lucide-react"

interface NumericFieldSumCardsProps {
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
  activeTab: TimeRange
}

export const NumericFieldSumCards = ({
  numericFieldSums,
  activeTab,
}: NumericFieldSumCardsProps) => {
  if (Object.keys(numericFieldSums).length === 0) return null

  return (
    <>
      {Object.entries(numericFieldSums).map(([field, sums]) => {
        const relevantSum =
          activeTab === "today"
            ? sums.today
            : activeTab === "week"
            ? sums.thisWeek
            : sums.thisMonth

        return (
          <Card key={field}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm/6 font-medium">{field}</p>
              <ChartNoAxesCombined className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-2xl font-bold">{relevantSum.toFixed(0)}</p>
              <p className="text-xs/5 text-muted-foreground">
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
        )
      })}
    </>
  )
}

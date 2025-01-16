import { CreateEventTypeModal } from "@/components/create-event-type-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { client } from "@/lib/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

export const DashboardEmptyState = () => {
  const queryClient = useQueryClient()

  const { mutate: insertQuickstartTypes, isPending } = useMutation({
    mutationFn: async () => {
      await client.type.insertQuickstartTypes.$post()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-types"] })
    },
  })

  return (
    <Card className="flex flex-col items-center justify-center rounded-2xl flex-1 text-center p-6 dark:bg-brand-950">
      <div className="flex justify-center w-full">
        <img
          src="/brand-asset-wave.png"
          alt="No types"
          className="size-48 -mt-24"
        />
      </div>

      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900 dark:text-gray-400">
        No Event Types Yet
      </h1>

      <p className="text-sm/6 text-gray-600 dark:text-gray-300 max-w-prose mt-2 mb-8">
        Start tracking events by creating your first type.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          variant="outline"
          className="flex items-center space-x-2 w-full sm:w-auto"
          onClick={() => insertQuickstartTypes()}
          disabled={isPending}
        >
          <span className="size-5">🚀</span>
          <span>{isPending ? "Creating starter types" : "Quickstart"}</span>
          {isPending && <Loader2 className="size-4 ml-2 animate-spin" />}
        </Button>

        <CreateEventTypeModal containerClassName="w-full sm:w-auto">
          <Button className="flex items-center space-x-2 w-full sm:w-auto">
            Add type
          </Button>
        </CreateEventTypeModal>
      </div>
    </Card>
  )
}

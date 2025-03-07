"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { client } from "@/lib/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import { BarChart2, Clock, Database, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DashboardEmptyState } from "@/app/(protected)/dashboard/dashboard-empty-state"

interface EventType {
  id: string
  color?: number // explicitly defining color as a number
  name: string
  slug: string
  emoji?: string
  createdAt: Date
  lastPing?: Date
  uniqueFieldCount?: number
  eventsCount?: number
}

export const DashboardPageContent = () => {
  const [deletingType, setDeletingType] = useState<{
    name: string
    slug: string
  } | null>(null)
  const queryClient = useQueryClient()

  const { data: types, isPending: isEventTypesLoading } = useQuery({
    queryKey: ["user-event-types"],
    queryFn: async () => {
      const res = await client.type.getEventTypes.$get()
      const { types } = await res.json()
      return types
    },
  })

  const { mutate: deleteType, isPending: isDeletingType } = useMutation({
    mutationFn: async (slug: string) => {
      await client.type.deleteType.$post({ slug })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-types"] })
      setDeletingType(null)
    },
  })

  if (isEventTypesLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!types || types.length === 0) {
    return <DashboardEmptyState />
  }

  return (
    <>
      <ul className="grid max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {types.map((type) => (
          <li
            key={type.id}
            className="relative group z-10 transition-all duration-200"
          >
            <div className="absolute z-0 inset-px rounded-lg bg-white dark:bg-brand-950" />

            <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5 dark:ring-white/60" />

            <div className="relative p-6 z-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="size-10 rounded-full"
                  style={{
                    backgroundColor: type.color
                      ? `#${type.color.toString(16).padStart(6, "0")}`
                      : "#f3f4f6",
                  }}
                />

                <div>
                  <h3 className="text-lg/7 font-medium tracking-tight text-gray-950 dark:text-gray-300">
                    {type.emoji || "📂"} {type.name}
                  </h3>
                  <p className="text-sm/6 text-gray-600 dark:text-gray-400">
                    {format(type.createdAt, "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Clock className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium dark:text-gray-300">
                    Last ping:
                  </span>
                  <span className="ml-1 dark:text-gray-400">
                    {type.lastPing
                      ? formatDistanceToNow(type.lastPing) + " ago"
                      : "Never"}
                  </span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Database className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium dark:text-gray-300">
                    Unique fields:
                  </span>
                  <span className="ml-1 dark:text-gray-400">
                    {type.uniqueFieldCount || 0}
                  </span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <BarChart2 className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium dark:text-gray-300">
                    Events this month:
                  </span>
                  <span className="ml-1 dark:text-gray-400">
                    {type.eventsCount || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Link
                  href={`/dashboard/type/${type.slug}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex items-center gap-2 text-sm",
                  })}
                >
                  View all
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  aria-label={`Delete ${type.name} type`}
                  onClick={() =>
                    setDeletingType({ name: type.name, slug: type.slug })
                  }
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        showModal={!!deletingType}
        setShowModal={() => setDeletingType(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950 dark:text-gray-200">
              Delete Type
            </h2>
            <p className="text-sm/6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete the type “{deletingType?.name}”?
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-brand-900">
            <Button
              variant="outline"
              onClick={() => setDeletingType(null)}
              className="dark:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingType && deleteType(deletingType.slug)}
              disabled={isDeletingType}
              className="flex justify-center items-center"
            >
              {isDeletingType ? (
                <>
                  Deleting
                  <Loader2 className="size-4 ml-2 animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

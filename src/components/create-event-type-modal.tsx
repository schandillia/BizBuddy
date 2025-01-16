"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PropsWithChildren, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { TYPE_NAME_VALIDATOR } from "@/lib/validators/type-validator"
import { Modal } from "@/components/ui/modal"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/client"
import { Loader2 } from "lucide-react"

const EVENT_TYPE_VALIDATOR = z.object({
  name: TYPE_NAME_VALIDATOR,
  color: z
    .string()
    .min(1, "Color is required")
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
  emoji: z.string().emoji("Invalid emoji").optional(),
})

type EventTypeForm = z.infer<typeof EVENT_TYPE_VALIDATOR>

const COLOR_OPTIONS = [
  "#FF6B6B", // bg-[#FF6B6B] ring-[#FF6B6B] Bright Red
  "#4ECDC4", // bg-[#4ECDC4] ring-[#4ECDC4] Teal
  "#45B7D1", // bg-[#45B7D1] ring-[#45B7D1] Sky Blue
  "#FFA07A", // bg-[#FFA07A] ring-[#FFA07A] Light Salmon
  "#98D8C8", // bg-[#98D8C8] ring-[#98D8C8] Seafoam Green
  "#FDCB6E", // bg-[#FDCB6E] ring-[#FDCB6E] Mustard Yellow
  "#6C5CE7", // bg-[#6C5CE7] ring-[#6C5CE7] Soft Purple
  "#FF85A2", // bg-[#FF85A2] ring-[#FF85A2] Pink
  "#2ECC71", // bg-[#2ECC71] ring-[#2ECC71] Emerald Green
  "#E17055", // bg-[#E17055] ring-[#E17055] Terracotta
]

const EMOJI_OPTIONS = [
  { emoji: "💰", label: "Money (Sale)" },
  { emoji: "👤", label: "User (Sign-up)" },
  { emoji: "🎉", label: "Celebration" },
  { emoji: "📅", label: "Calendar" },
  { emoji: "🚀", label: "Launch" },
  { emoji: "📢", label: "Announcement" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "🏆", label: "Achievement" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🔔", label: "Notification" },
  { emoji: "🐞", label: "Bug" },
]

interface CreateEventTypeModel extends PropsWithChildren {
  containerClassName?: string
}

export const CreateEventTypeModal = ({
  children,
  containerClassName,
}: CreateEventTypeModel) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createEventType, isPending } = useMutation({
    mutationFn: async (data: EventTypeForm) => {
      try {
        // Call the API to create the event type
        await client.type.createEventType.$post(data)
      } catch (error: any) {
        // Handle any errors such as name already being taken
        if (
          error?.response?.status === 400 &&
          error?.response?.data?.error?.message
        ) {
          throw new Error(error?.response?.data?.error?.message)
        }
        throw error // Re-throw if it's a different error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-event-types"] })
      setIsOpen(false)
    },
    onError: (error: Error) => {
      // Handle error globally in the UI, such as name already taken
      alert(error.message) // Example, you could replace it with better UX handling
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventTypeForm>({
    resolver: zodResolver(EVENT_TYPE_VALIDATOR),
  })

  const color = watch("color")
  const selectedEmoji = watch("emoji")

  const onSubmit = (data: EventTypeForm) => {
    createEventType(data)
    reset() // Reset all form fields
  }

  return (
    <>
      <div className={containerClassName} onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Modal
        className="max-w-xl p-8"
        showModal={isOpen}
        setShowModal={(open) => {
          setIsOpen(open)
          if (!open) {
            // When modal is closing
            reset() // Reset all form fields
          }
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950 dark:text-gray-200">
              New Event Type
            </h2>
            <p className="text-sm/6 text-gray-600 dark:text-gray-300">
              Create a new type to organize your events.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="dark:text-gray-400">
                Name
              </Label>
              <Input
                autoFocus
                id="name"
                {...register("name")}
                placeholder="e.g. User Signup"
                className="w-full"
              />
              {errors.name ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <Label className="dark:text-gray-400">Color</Label>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map((premadeColor) => (
                  <button
                    key={premadeColor}
                    type="button"
                    className={cn(
                      `bg-[${premadeColor}]`,
                      "size-10 rounded-full ring-2 ring-offset-2 transition-all",
                      color === premadeColor
                        ? "ring-brand-700 scale-110"
                        : "ring-transparent hover:scale-105"
                    )}
                    onClick={() => setValue("color", premadeColor)}
                  ></button>
                ))}
              </div>

              {errors.color ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.color.message}
                </p>
              ) : null}
            </div>

            <div>
              <Label className="dark:text-gray-400">Emoji</Label>
              <div className="flex flex-wrap gap-3">
                {EMOJI_OPTIONS.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    type="button"
                    className={cn(
                      "size-10 flex items-center justify-center text-xl rounded-md transition-all",
                      selectedEmoji === emoji
                        ? "bg-brand-100 ring-2 ring-brand-700 scale-110"
                        : "bg-brand-100 hover:bg-brand-200"
                    )}
                    onClick={() => setValue("emoji", emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {errors.emoji ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emoji.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="dark:text-gray-400"
              onClick={() => {
                setIsOpen(false)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full flex justify-center items-center" // Flexbox to center the loader and text
            >
              {isPending ? (
                <>
                  Creating Type
                  <Loader2 className="size-4 ml-2 animate-spin" />
                </>
              ) : (
                "Create Type"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

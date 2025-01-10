import { z } from "zod"

export const TYPE_NAME_VALIDATOR = z
  .string()
  .min(1, "Type name is required.")
  .regex(
    /^[a-zA-Z0-9-\s]+$/,
    "Type name can only contain letters, numbers, or hyphens."
  )

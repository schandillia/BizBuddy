import { router } from "../__internals/router"
import { getEventTypes } from "./type-router-helpers/get-event-types"
import { deleteType } from "./type-router-helpers/delete-type"
import { createEventType } from "./type-router-helpers/create-event-type"
import { insertQuickstartTypes } from "./type-router-helpers/insert-quickstart-types"
import { pollType } from "./type-router-helpers/poll-type"
import { getEventsByTypeName } from "./type-router-helpers/get-events-by-type-name"

export const typeRouter = router({
  getEventTypes,
  deleteType,
  createEventType,
  insertQuickstartTypes,
  pollType,
  getEventsByTypeName,
})

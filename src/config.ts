// 👇 constant value in all uppercase
export const FREE_QUOTA = {
  maxEventsPerMonth: 100,
  maxEventTypes: 3,
} as const

export const PRO_QUOTA = {
  maxEventsPerMonth: 1000,
  maxEventTypes: 10,
} as const

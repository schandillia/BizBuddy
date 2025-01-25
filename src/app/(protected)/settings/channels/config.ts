export const SERVICE_NAMES = {
  DISCORD: "Discord",
  EMAIL: "Email",
  WEBEX: "Webex",
  SLACK: "Slack",
} as const

export const serviceConfigs = [
  {
    name: "DISCORD",
    displayName: SERVICE_NAMES.DISCORD,
    placeholder: `Enter your ${SERVICE_NAMES.DISCORD} ID`,
    maxLength: 20,
  },
  {
    name: "EMAIL",
    displayName: SERVICE_NAMES.EMAIL,
    placeholder: `Enter your ${SERVICE_NAMES.EMAIL} ID`,
    maxLength: 254,
  },
  {
    name: "WEBEX",
    displayName: SERVICE_NAMES.WEBEX,
    placeholder: `Enter your ${SERVICE_NAMES.WEBEX} ID`,
    maxLength: 100,
  },
  {
    name: "SLACK",
    displayName: SERVICE_NAMES.SLACK,
    placeholder: `Enter your ${SERVICE_NAMES.SLACK} ID`,
    maxLength: 20,
  },
] as const

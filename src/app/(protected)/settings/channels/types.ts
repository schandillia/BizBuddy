export type ServiceName = "DISCORD" | "EMAIL" | "WEBEX" | "SLACK" | "NONE"

export type ChannelIds = {
  [K in Exclude<ServiceName, "NONE">]: string
}

import { DiscordMessage } from "@/components/discord-message"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { MockDiscordUI } from "@/components/mock-discord-ui"
import { AnimatedList } from "@/components/ui/animated-list"
import brand from "@/lib/constants/brand.json"

const ChannelDemo = () => {
  return (
    <section className="relative bg-brand-25 dark:bg-brand-950 pb-4">
      <div className="absolute inset-x-0 bottom-24 top-24 bg-brand-800" />
      <div className="relative mx-auto">
        <MaxWidthWrapper className="relative">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <MockDiscordUI>
              <AnimatedList>
                <DiscordMessage
                  avatarSrc="/images/brand-asset-profile-picture.png"
                  avatarAlt={`${brand.BRAND} Avatar`}
                  username={`${brand.BRAND}`}
                  timestamp="Today at 12:35PM"
                  badgeText="SignUp"
                  badgeColor="#43b581"
                  title="👤 New user signed up"
                  content={{
                    name: "Isaac Newton",
                    email: "isaac@newton.com",
                  }}
                />
                <DiscordMessage
                  avatarSrc="/images/brand-asset-profile-picture.png"
                  avatarAlt={`${brand.BRAND} Avatar`}
                  username={`${brand.BRAND}`}
                  timestamp="Today at 12:35PM"
                  badgeText="Revenue"
                  badgeColor="#faa61a"
                  title="💰 Payment received"
                  content={{
                    amount: "$49.00",
                    email: "albert@einstein.com",
                    plan: "PRO",
                  }}
                />
                <DiscordMessage
                  avatarSrc="/images/brand-asset-profile-picture.png"
                  avatarAlt={`${brand.BRAND} Avatar`}
                  username={`${brand.BRAND}`}
                  timestamp="Today at 5:11AM"
                  badgeText="Milestone"
                  badgeColor="#5865f2"
                  title="🚀 Revenue Milestone Achieved"
                  content={{
                    recurringRevenue: "$5.000 USD",
                    growth: "+8.2%",
                  }}
                />
              </AnimatedList>
            </MockDiscordUI>
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  )
}

export default ChannelDemo

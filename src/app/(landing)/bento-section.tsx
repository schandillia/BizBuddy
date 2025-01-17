import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import Image from "next/image"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import brand from "@/lib/constants/brand.json"

const BentoSection = () => {
  const codeSnippet = `await fetch("http://localhost:3000/api/v1/events", {
  method: "POST",
  body: JSON.stringify({
    type: "sale",
    fields: {
      plan: "PRO",
      email: "albert@einstein.com",
      amount: 49.00
    }
  }),
  headers: {
    Authorization: "Bearer <YOUR_API_KEY>"
  }
})`

  return (
    <section className="relative py-24 sm:py-32 bg-brand-25 dark:bg-brand-950">
      <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
        <div>
          <h2 className="text-center text-base/7 font-semibold text-brand-600">
            Intuitive Monitoring
          </h2>
          <Heading>Stay ahead with real-time insights</Heading>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {/* first bento grid element */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white dark:bg-brand-900 lg:rounded-l-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 dark:text-brand-100 max-lg:text-center">
                  Real-time notifications
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-300 max-lg:text-center">
                  Get notified about critical events the moment they happen, no
                  matter if you're at home or on the go.
                </p>
              </div>

              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <Image
                    className="size-full object-cover object-top"
                    src="/images/phone-screen.png"
                    alt="Phone screen displaying app interface"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]" />
          </div>

          {/* second bento grid element */}
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-white dark:bg-brand-900 max-lg:rounded-t-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 dark:text-brand-100 max-lg:text-center">
                  Track Any Event
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-300 max-lg:text-center">
                  From new user signups to successful payments, {brand.BRAND}
                  notifies you for all critical events in your SaaS.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <Image
                  className="w-full max-lg:max-w-xs"
                  src="/images/bento-any-event.png"
                  alt="Bento box illustrating event tracking"
                  width={500}
                  height={300}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]" />
          </div>

          {/* third bento grid element */}
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-white dark:bg-brand-900" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 dark:text-brand-100 max-lg:text-center">
                  Track Any Property
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-300 max-lg:text-center">
                  Add any custom data you like to an event, such as a user
                  email, a purchase amount or an exceeded quota.
                </p>
              </div>

              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <Image
                  className="w-full max-lg:max-w-xs"
                  src="/images/bento-custom-data.png"
                  alt="Bento box illustrating custom data tracking"
                  width={500}
                  height={300}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
          </div>

          {/* fourth bento grid element */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white dark:bg-brand-900 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 dark:text-brand-100 max-lg:text-center">
                  Easy Channel
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-300 max-lg:text-center">
                  Connect {brand.BRAND} with your existing workflows in minutes
                  and call our intuitive logging API from any language.
                </p>
              </div>

              <div className="relative min-h-[30rem] w-full grow">
                <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                  <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                      <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                        {`${brand.BRAND.toLowerCase()}.js`}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <div className="max-h-[30rem]">
                      <SyntaxHighlighter
                        language="typescript"
                        style={{
                          ...oneDark,
                          'pre[class*="language-"]': {
                            ...oneDark['pre[class*="language-"]'],
                            background: "transparent",
                            overflow: "hidden",
                          },
                          'code[class*="language-"]': {
                            ...oneDark['code[class*="language-"]'],
                            background: "transparent",
                          },
                        }}
                      >
                        {codeSnippet}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

export default BentoSection

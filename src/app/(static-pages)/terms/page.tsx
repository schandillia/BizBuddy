import type { Metadata } from "next"

import { MaxWidthWrapper } from "@/components/max-width-wrapper"

import meta from "@/lib/constants/meta.json"

export const metadata: Metadata = {
  title: meta.TERMS.TITLE,
  description: meta.TERMS.DESCRIPTION,
}

const Page = () => (
  <>
    <p>Terms of service</p>
  </>
)

export default Page

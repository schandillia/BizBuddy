import type { Metadata } from "next"

import { MaxWidthWrapper } from "@/components/max-width-wrapper"

import meta from "@/lib/constants/meta.json"

export const metadata: Metadata = {
  title: meta.PRIVACY.TITLE,
  description: meta.PRIVACY.DESCRIPTION,
}

const Page = () => (
  <>
    <p>Privacy</p>
  </>
)

export default Page

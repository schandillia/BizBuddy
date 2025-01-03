import type { Metadata } from "next"

import DocumentRenderer from "@/components/document-renderer"

import meta from "@/lib/constants/meta.json"
import { Heading } from "@/components/heading"

export const metadata: Metadata = {
  title: meta.PRIVACY.TITLE,
  description: meta.PRIVACY.DESCRIPTION,
}

const Page = () => (
  <>
    <Heading>Privacy Policy</Heading>
    <DocumentRenderer markdownDocument="PRIVACY.md" />
  </>
)

export default Page

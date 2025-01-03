import type { Metadata } from "next"

import DocumentRenderer from "@/components/document-renderer"

import meta from "@/lib/constants/meta.json"
import { Heading } from "@/components/heading"

export const metadata: Metadata = {
  title: meta.TERMS.TITLE,
  description: meta.TERMS.DESCRIPTION,
}

const Page = () => (
  <>
    <Heading>Terms of Service</Heading>
    <DocumentRenderer markdownDocument="TERMS.md" />
  </>
)

export default Page

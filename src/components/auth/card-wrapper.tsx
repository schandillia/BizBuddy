"use client"

import { Card } from "@/components/ui/card"
import { Header } from "@/components/auth/header"
import { Social } from "@/components/auth/social"
import { BackButton } from "@/components/auth/back-button"

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  headerTitle?: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
}

export const CardWrapper = ({
  children,
  headerLabel,
  headerTitle,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <Header label={headerLabel} title={headerTitle} />
      {children}
      {showSocial && <Social />}
      <BackButton label={backButtonLabel} href={backButtonHref} />
    </Card>
  )
}

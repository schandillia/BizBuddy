"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    // Sync with localStorage on mount
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme && !props.defaultTheme) {
      props.defaultTheme = storedTheme
    }
  }, [props])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

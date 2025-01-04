import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { cn } from "@/utils"
import { bodyFont, accentFont } from "@/lib/style/fonts"

import "./globals.css"
import { db } from "@/db"
import { ClerkProvider } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import meta from "@/lib/constants/meta.json"
import { ThemeProvider } from "@/components/theme/theme-provider"

export const metadata: Metadata = {
  title: meta.HOME.TITLE,
  description: meta.HOME.DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const auth = await currentUser()
  const user = auth
    ? await db.user.findUnique({
        where: { externalId: auth.id },
      })
    : null

  const preferredTheme = user?.theme.toLowerCase()

  const fontSizeMap: Record<number, string> = {
    12: "text-xs",
    14: "text-sm",
    16: "text-base",
    18: "text-lg",
  }
  // Updated script to handle theme initialization for both logged-in and non-logged-in users
  const themeScript = `
    try {
      const isLoggedIn = ${!!auth};
      const dbTheme = '${preferredTheme ?? ""}';
      
      if (isLoggedIn && dbTheme) {
        // For logged-in users, use DB theme
        localStorage.setItem('theme', dbTheme);
      } else if (!isLoggedIn) {
        // For non-logged-in users, keep existing localStorage theme if it exists
        const storedTheme = localStorage.getItem('theme');
        if (!storedTheme) {
          // If no theme is stored, set default
          localStorage.setItem('theme', 'dark');
        }
      }
    } catch (e) {}
  `

  // Get initial theme based on user status
  const initialTheme = preferredTheme ?? "dark"

  return (
    <ClerkProvider>
      <html lang="en" className={cn(bodyFont.variable, accentFont.variable)}>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body className="min-h-[calc(100vh-1px)] flex flex-col font-sans bg-brand-50 dark:bg-brand-950 text-brand-950 antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme={initialTheme}
            enableSystem
            disableTransitionOnChange
            storageKey="theme" // Add this to ensure next-themes uses the same localStorage key
          >
            <main className="relative flex-1 flex flex-col">
              <Providers>{children}</Providers>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

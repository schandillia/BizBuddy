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
  const initialTheme = preferredTheme ?? "dark"

  // Simplified theme script
  const themeScript = `
    try {
      const getTheme = () => {
        const isLoggedIn = ${!!auth};
        const dbTheme = '${preferredTheme ?? ""}';
        
        if (isLoggedIn && dbTheme) {
          return dbTheme;
        }
        return localStorage.getItem('theme') || 'dark';
      };
      
      const theme = getTheme();
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    } catch (e) {}
  `

  return (
    <html
      lang="en"
      className={cn(bodyFont.variable, accentFont.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="min-h-[calc(100vh-1px)] flex flex-col font-sans bg-brand-50 dark:bg-brand-950 text-brand-950 antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={initialTheme}
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <ClerkProvider>
            <main className="relative flex-1 flex flex-col">
              <Providers>{children}</Providers>
            </main>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

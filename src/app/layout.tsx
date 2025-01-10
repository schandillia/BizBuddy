import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { cn } from "@/utils"
import { bodyFont, accentFont } from "@/lib/style/fonts"
import { AuthProvider } from "@/components/auth/auth-provider"

import "./globals.css"
import { db } from "@/db"
import { auth } from "@/auth"
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
  const session = await auth()
  let user = null
  if (session?.user?.id) {
    try {
      user = await db.user.findUnique({
        where: { id: session.user.id },
      })
    } catch (error) {
      console.error("Error fetching user:", error)
      // Handle the error appropriately, e.g., log it, display a message, or redirect
    }
  } else {
    // Handle the case where the user is not logged in or the ID is missing
    console.log("No user session or ID found.")
  }

  const preferredTheme = user?.theme?.toLowerCase()
  const initialTheme = preferredTheme ?? "dark"

  // Simplified theme script
  const themeScript = `
    try {
      const getTheme = () => {
        const isLoggedIn = ${!!session};
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
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme={initialTheme}
            enableSystem
            disableTransitionOnChange
            storageKey="theme"
          >
            <main className="relative flex-1 flex flex-col">
              <Providers>{children}</Providers>
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

import { Inter, Noto_Serif } from "next/font/google"

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const accentFont = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
})

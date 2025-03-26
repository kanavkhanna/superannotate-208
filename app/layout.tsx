import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Sora } from "next/font/google"

const sora = Sora({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BrewFinder - Discover Local Coffee Shops",
  description: "Find the perfect coffee shop for your needs with BrewFinder",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sora.className} bg-[#FDF6EC]`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'
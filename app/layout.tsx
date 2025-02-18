import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EWSD Project",
  description: "EWSD Project using Zustand & Zod",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html data-theme="lemonade" lang="en">
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  )
}


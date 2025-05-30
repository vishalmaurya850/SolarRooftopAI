import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SolarScan AI - AI-Powered Rooftop Solar Analysis",
  description:
    "Upload satellite imagery and get instant AI-powered assessments of solar potential, installation recommendations, and ROI estimates.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />{children}</Providers>
      </body>
    </html>
  )
}

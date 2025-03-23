import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "AI Forms",
  description: "Create forms using AI"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          `${geistSans.variable} ${geistMono.variable} antialiased` +
          "m-0 w-screen flex flex-col gap-4 relative"
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header/>
          {children}
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  )
}

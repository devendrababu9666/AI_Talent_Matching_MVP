import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"], 
})

export const metadata: Metadata = {
  title: "HCLTech Talent Search",
  description: "Internal Talent Intelligence Platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {/* <nav className="bg-[linear-gradient(110deg,#0F5FDC_0%,#0A6DB4_55%,#3341A5_100%)] text-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              HCLTech
            </Link>
          </div>
        </nav> */}
        <nav className="bg-[linear-gradient(110deg,#0F5FDC_0%,#0A6DB4_55%,#3341A5_100%)] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Brand */}
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            HCLTech
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Link
              href="/talent-search"
              className="rounded-md px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              Talent Search
            </Link>

            <Link
              href="/match-jd"
              className="rounded-md px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              JD Matching
            </Link>
          </div>

        </div>
      </nav>
        {children}
      </body>
    </html>
  )
}

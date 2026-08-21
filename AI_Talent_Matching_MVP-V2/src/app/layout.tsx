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
        {/* Top navigation */}
        <nav className="hcl-primary-gradient text-white shadow-sm">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            {/* Brand */}
            <Link href="/" className="text-2xl font-black tracking-tight text-white">
              HCLTech
            </Link>

            {/* Navigation links */}
            <div className="flex items-center gap-3 text-sm font-bold">
              <Link
                href="/match-jd"
                className="rounded-xl px-4 py-2 text-white/90 transition hover:bg-white/15 hover:text-white"
              >
                JD Matching
              </Link>
              <Link
                href="/talent-search"
                className="rounded-xl px-4 py-2 text-white/90 transition hover:bg-white/15 hover:text-white"
              >
                Talent Search
              </Link>
              <Link
                href="/resume-upload"
                className="rounded-xl px-4 py-2 text-white/90 transition hover:bg-white/15 hover:text-white"
              >
                Resume Upload
              </Link>
            </div>
          </div>
        </nav>

        {/* Secondary nav (optional)
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            HCLTech
          </Link>
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
        </div> */}

        {children}
      </body>
    </html>
  )
}

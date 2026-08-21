"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 opacity-95" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-100">
              Talent Intelligence Platform
            </p>

            <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
              Find the right talent,
              <br />
              faster.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50">
              Search, discover and match talent across the organization
              using intelligent candidate insights.
            </p>

            <div className="mt-8">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <Link href="/talent-search">
                  Search Talent
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
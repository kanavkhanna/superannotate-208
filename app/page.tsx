"use client"

import { CoffeeShopList } from "@/components/coffee-shop-list"
import { FilterBar } from "@/components/filter-bar"
import { Coffee } from "lucide-react"

// Ensure the global review store is properly initialized
const initGlobalReviewStore = `
  if (typeof window !== 'undefined') {
    if (!window.__REVIEW_STORE) {
      window.__REVIEW_STORE = {};
    }
  }
`

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF6EC]">
      {/* Add script to initialize global review store */}
      <script dangerouslySetInnerHTML={{ __html: initGlobalReviewStore }} />

      <header className="bg-[#5E3A21] text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between py-4">
          <h1
            className="text-2xl font-bold tracking-tight flex items-center gap-2 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <Coffee className="h-6 w-6" />
            <span>
              Brew<span className="text-[#E6C9A8]">Finder</span>
            </span>
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#5E3A21] sm:text-4xl md:text-5xl">
              Discover Local Coffee Shops
            </h2>
            <p className="mx-auto max-w-[700px] text-[#8B5A3C] md:text-lg">
              Find the perfect spot for your coffee break, work session, or casual meetup.
            </p>
          </div>
          <FilterBar />
          <CoffeeShopList />
        </div>
      </main>
      <footer className="bg-[#5E3A21] text-white mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
          © {new Date().getFullYear()} BrewFinder. All rights reserved.
        </div>
      </footer>
    </div>
  )
}


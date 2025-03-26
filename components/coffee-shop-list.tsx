"use client"

import { useState, useEffect, useCallback } from "react"
import { CoffeeShopCard } from "@/components/coffee-shop-card"
import { CoffeeShopDetail } from "@/components/coffee-shop-detail"
import { coffeeShops } from "@/data/coffee-shops"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCcw, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CoffeeShop } from "@/types/coffee-shop"
import { initializeFromWindow, syncToWindow, getReviews } from "@/lib/review-store"

// Create a context to share search and filter state
export type FilterState = {
  wifi: boolean
  seating: boolean
  powerOutlets: boolean
  quietSpace: boolean
}

// Extend Window interface to include our global review store
declare global {
  interface Window {
    coffeeShopSearch?: {
      setSearchTerm: (term: string) => void
      setFilters: (filters: FilterState) => void
      clearSearch: () => void
      clearFilters: () => void
      getFilters: () => FilterState
      getSearchTerm: () => string
    }
  }
}

export function CoffeeShopList() {
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [allShops] = useState<CoffeeShop[]>(coffeeShops)
  const [filteredShops, setFilteredShops] = useState<CoffeeShop[]>(coffeeShops)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    wifi: false,
    seating: false,
    powerOutlets: false,
    quietSpace: false,
  })

  // Initialize review store from window if it exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeFromWindow()
    }
  }, [])

  // Apply search and filters
  const applySearchAndFilters = useCallback(() => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      try {
        let results = [...allShops]

        // Apply search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim()
          results = results.filter(
            (shop) =>
              shop.name.toLowerCase().includes(term) ||
              shop.description.toLowerCase().includes(term) ||
              shop.location.city.toLowerCase().includes(term) ||
              shop.specialties.some((s) => s.toLowerCase().includes(term)),
          )
        }

        // Apply filters
        const activeFilters = Object.entries(filters).filter(([_, value]) => value)

        if (activeFilters.length > 0) {
          results = results.filter((shop) => {
            return activeFilters.every(([key]) => {
              return shop.amenities[key as keyof typeof shop.amenities]
            })
          })
        }

        setFilteredShops(results)

        // Only show toast for no results, not for every filter change
        if (results.length === 0 && (searchTerm || activeFilters.length > 0)) {
          toast.info("No matches found", {
            description: "Try adjusting your search or filters",
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
          toast.error("Error applying filters", {
            description: error.message,
          })
        }
      } finally {
        setIsLoading(false)
      }
    }, 500) // Short delay for better UX
  }, [allShops, searchTerm, filters])

  // Update filtered shops when search or filters change
  useEffect(() => {
    applySearchAndFilters()
  }, [applySearchAndFilters])

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setFilteredShops(allShops)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
          toast.error("Error Loading Data", {
            description: error.message,
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [allShops])

  // Make search and filter functions available to other components
  useEffect(() => {
    // Expose search and filter functions to window for other components to use
    if (typeof window !== "undefined") {
      window.coffeeShopSearch = {
        setSearchTerm: (term: string) => {
          setSearchTerm(term)
        },
        setFilters: (newFilters: FilterState) => {
          setFilters(newFilters)
        },
        clearSearch: () => {
          setSearchTerm("")
        },
        clearFilters: () => {
          setFilters({
            wifi: false,
            seating: false,
            powerOutlets: false,
            quietSpace: false,
          })
        },
        getFilters: () => filters,
        getSearchTerm: () => searchTerm,
      }
    }

    return () => {
      // Sync our review store to window before unmounting
      if (typeof window !== "undefined") {
        syncToWindow()
      }
    }
  }, [filters, searchTerm])

  // Add event listener for logo click
  useEffect(() => {
    const handleLogoClick = () => {
      setSelectedShop(null)
    }

    if (typeof window !== "undefined") {
      // Find the logo element and add click handler
      const logoElement = document.querySelector("h1.cursor-pointer")
      if (logoElement) {
        logoElement.addEventListener("click", handleLogoClick)
      }

      return () => {
        if (logoElement) {
          logoElement.removeEventListener("click", handleLogoClick)
        }
      }
    }

    return undefined
  }, [])

  const handleRetry = () => {
    // Reload data
    setIsLoading(true)
    setError(null)

    toast.loading("Refreshing data...", {
      id: "refresh-data",
    })

    // Simulate API call
    setTimeout(() => {
      setFilteredShops(allShops)
      setIsLoading(false)
      toast.success("Data refreshed successfully", {
        id: "refresh-data",
        description: `Found ${allShops.length} coffee shops in your area.`,
      })
    }, 1000)
  }

  if (isLoading) {
    return (
      // Fix skeleton loader to match grid layout
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-[400px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-card">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{error}</p>
          <Button variant="outline" size="sm" className="w-fit" onClick={handleRetry}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (selectedShop) {
    const shop = allShops.find((shop) => shop.id === selectedShop)
    if (shop) {
      // Get any user-added reviews for this shop from our review store
      const userReviews = getReviews(shop.id)

      // Create a copy of the shop with combined reviews
      const shopWithUserReviews = {
        ...shop,
        reviews: [...userReviews, ...shop.reviews.filter((review) => review.user !== "You")],
      }

      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <CoffeeShopDetail shop={shopWithUserReviews} onBack={() => setSelectedShop(null)} />
          </motion.div>
        </AnimatePresence>
      )
    }
  }

  if (filteredShops.length === 0) {
    return (
      <Alert className="py-8 bg-card">
        <div className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-primary" />
          <AlertTitle className="text-lg text-primary mt-0">No coffee shops found</AlertTitle>
        </div>
        <AlertDescription className="mt-2 text-muted-foreground">
          Try adjusting your search or filter criteria to find coffee shops.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredShops.map((shop, index) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: index * 0.05 },
            }}
          >
            <CoffeeShopCard
              shop={shop}
              onClick={() => {
                try {
                  setSelectedShop(shop.id)
                } catch (error) {
                  if (error instanceof Error) {
                    toast.error("Error", {
                      description: error.message,
                    })
                  }
                }
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}


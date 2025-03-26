"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, AlertCircle, X, Coffee } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FilterState } from "@/components/coffee-shop-list"

const searchSchema = z.object({
  searchTerm: z.string().max(50, {
    message: "Search term cannot be longer than 50 characters",
  }),
})

type SearchFormValues = z.infer<typeof searchSchema>

export function FilterBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    wifi: false,
    seating: false,
    powerOutlets: false,
    quietSpace: false,
  })
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: "",
    },
  })

  // Sync with global search state
  useEffect(() => {
    if (window.coffeeShopSearch) {
      // Initialize form with current search term
      const currentTerm = window.coffeeShopSearch.getSearchTerm()
      if (currentTerm) {
        form.setValue("searchTerm", currentTerm)
      }

      // Initialize filters with current filter state
      const currentFilters = window.coffeeShopSearch.getFilters()
      setFilters(currentFilters)
    }
  }, [form])

  const handleFilterChange = (filter: keyof FilterState) => {
    try {
      const newFilters = {
        ...filters,
        [filter]: !filters[filter],
      }

      setFilters(newFilters)

      // Update global search state
      if (window.coffeeShopSearch) {
        window.coffeeShopSearch.setFilters(newFilters)
      }

      // Removed toast notification for filter changes
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Filter Error", {
          description: error.message,
        })
      }
    }
  }

  const onSubmit = async (data: SearchFormValues) => {
    try {
      // Clear any previous errors
      setSearchError(null)

      // Only show loading toast for empty searches
      if (!data.searchTerm.trim() && form.getValues("searchTerm").trim()) {
        toast.loading("Clearing search...", {
          id: "search-toast",
        })
      }

      // Update global search state
      if (window.coffeeShopSearch) {
        window.coffeeShopSearch.setSearchTerm(data.searchTerm)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHasSearched(true)

      // Only show success toast for empty searches (clearing)
      if (!data.searchTerm.trim() && form.getValues("searchTerm").trim()) {
        toast.success("Search cleared", {
          id: "search-toast",
          description: "Showing all coffee shops",
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        setSearchError(error.message)
        toast.error("Search Failed", {
          id: "search-toast",
          description: error.message,
        })
      }
    }
  }

  const clearSearch = () => {
    form.reset({ searchTerm: "" })
    setHasSearched(false)
    setSearchError(null)

    // Update global search state
    if (window.coffeeShopSearch) {
      window.coffeeShopSearch.clearSearch()
    }

    // Keep this toast as it's a user-initiated action
    toast.success("Search cleared", {
      description: "Showing all coffee shops",
    })
  }

  const clearAllFilters = () => {
    try {
      const emptyFilters = {
        wifi: false,
        seating: false,
        powerOutlets: false,
        quietSpace: false,
      }

      setFilters(emptyFilters)

      // Update global search state
      if (window.coffeeShopSearch) {
        window.coffeeShopSearch.clearFilters()
      }

      // Keep this toast as it's a user-initiated action to clear all filters
      toast.success("Filters cleared", {
        description: "All filters have been reset",
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Filter Error", {
          description: error.message,
        })
      }
    }
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const toggleFilters = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="mb-8 space-y-4 rounded-lg bg-white p-4 shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B5A3C]" />
                    <Input
                      placeholder="Search coffee shops..."
                      className="pl-10 pr-28 border-[#E6C9A8] focus-visible:ring-[#8B5A3C]"
                      {...field}
                    />
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-[85px] top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-[#FDF6EC]"
                        onClick={clearSearch}
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 bg-[#5E3A21] hover:bg-[#8B5A3C]"
                    >
                      Search
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {searchError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}

          {hasSearched && !searchError && !form.getValues("searchTerm") && (
            <Alert className="mt-2 border-[#E6C9A8] bg-[#FDF6EC]">
              <AlertDescription>Search cleared. Showing all coffee shops.</AlertDescription>
            </Alert>
          )}
        </form>
      </Form>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 px-2 text-[#5E3A21] hover:bg-[#FDF6EC] hover:text-[#8B5A3C]"
            onClick={toggleFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 flex items-center justify-center h-5 w-5 rounded-full p-0 text-xs bg-[#8B5A3C] text-white"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-[#8B5A3C] hover:text-[#5E3A21] hover:bg-[#FDF6EC]"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          )}
        </div>

        {isOpen && (
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#FDF6EC] transition-colors">
                <Checkbox
                  id="wifi"
                  checked={filters.wifi}
                  onCheckedChange={() => handleFilterChange("wifi")}
                  className="border-[#8B5A3C] data-[state=checked]:bg-[#5E3A21] data-[state=checked]:text-white"
                />
                <Label htmlFor="wifi" className="text-sm font-medium leading-none cursor-pointer text-[#5E3A21]">
                  WiFi
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#FDF6EC] transition-colors">
                <Checkbox
                  id="seating"
                  checked={filters.seating}
                  onCheckedChange={() => handleFilterChange("seating")}
                  className="border-[#8B5A3C] data-[state=checked]:bg-[#5E3A21] data-[state=checked]:text-white"
                />
                <Label htmlFor="seating" className="text-sm font-medium leading-none cursor-pointer text-[#5E3A21]">
                  Seating
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#FDF6EC] transition-colors">
                <Checkbox
                  id="powerOutlets"
                  checked={filters.powerOutlets}
                  onCheckedChange={() => handleFilterChange("powerOutlets")}
                  className="border-[#8B5A3C] data-[state=checked]:bg-[#5E3A21] data-[state=checked]:text-white"
                />
                <Label
                  htmlFor="powerOutlets"
                  className="text-sm font-medium leading-none cursor-pointer text-[#5E3A21]"
                >
                  Power Outlets
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#FDF6EC] transition-colors">
                <Checkbox
                  id="quietSpace"
                  checked={filters.quietSpace}
                  onCheckedChange={() => handleFilterChange("quietSpace")}
                  className="border-[#8B5A3C] data-[state=checked]:bg-[#5E3A21] data-[state=checked]:text-white"
                />
                <Label htmlFor="quietSpace" className="text-sm font-medium leading-none cursor-pointer text-[#5E3A21]">
                  Quiet Space
                </Label>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDF6EC] text-[#8B5A3C] rounded-full text-sm">
                <Coffee className="h-3.5 w-3.5" />
                <span>Find your perfect coffee spot</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


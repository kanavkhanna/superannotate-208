"use client"

import { useState, useEffect } from "react"
import { Search, X, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
  const [filters, setFilters] = useState<FilterState>({
    wifi: false,
    seating: false,
    powerOutlets: false,
    quietSpace: false,
  })
  const [searchError, setSearchError] = useState<string | null>(null)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: "",
    },
  })

  // Sync with global search state
  useEffect(() => {
    if (typeof window !== "undefined" && window.coffeeShopSearch) {
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
      if (typeof window !== "undefined" && window.coffeeShopSearch) {
        window.coffeeShopSearch.setFilters(newFilters)
      }
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
      if (typeof window !== "undefined" && window.coffeeShopSearch) {
        window.coffeeShopSearch.setSearchTerm(data.searchTerm)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

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
    setSearchError(null)

    // Update global search state
    if (typeof window !== "undefined" && window.coffeeShopSearch) {
      window.coffeeShopSearch.clearSearch()
    }
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
      if (typeof window !== "undefined" && window.coffeeShopSearch) {
        window.coffeeShopSearch.clearFilters()
      }

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

  return (
    <div className="mb-8 space-y-4 rounded-lg bg-card p-4 shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search coffee shops..." className="pl-10 pr-28" {...field} />
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-[85px] top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted"
                        onClick={clearSearch}
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7">
                      Search
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {searchError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}
        </form>
      </Form>

      {/* Filter options with responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col flex-wrap gap-2 sm:flex-row">
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
            <Checkbox id="wifi" checked={filters.wifi} onCheckedChange={() => handleFilterChange("wifi")} />
            <Label htmlFor="wifi" className="text-sm font-medium leading-none cursor-pointer text-primary">
              WiFi
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
            <Checkbox id="seating" checked={filters.seating} onCheckedChange={() => handleFilterChange("seating")} />
            <Label htmlFor="seating" className="text-sm font-medium leading-none cursor-pointer text-primary">
              Seating
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
            <Checkbox
              id="powerOutlets"
              checked={filters.powerOutlets}
              onCheckedChange={() => handleFilterChange("powerOutlets")}
            />
            <Label htmlFor="powerOutlets" className="text-sm font-medium leading-none cursor-pointer text-primary">
              Power Outlets
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
            <Checkbox
              id="quietSpace"
              checked={filters.quietSpace}
              onCheckedChange={() => handleFilterChange("quietSpace")}
            />
            <Label htmlFor="quietSpace" className="text-sm font-medium leading-none cursor-pointer text-primary">
              Quiet Space
            </Label>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-primary hover:bg-muted self-start sm:self-center"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}


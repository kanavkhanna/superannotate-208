"use client"

import Image from "next/image"
import { ArrowLeft, Star, MapPin, Wifi, Users, Power, VolumeX, Clock, ExternalLink, Coffee, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleMap } from "@/components/simple-map"
import { ReviewSection } from "@/components/review-section"
import type { CoffeeShop, Review } from "@/types/coffee-shop"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useMemo, useState, useEffect } from "react"
import { getReviews } from "@/lib/review-store"
import { Card, CardContent } from "@/components/ui/card"

interface CoffeeShopDetailProps {
  shop: CoffeeShop
  onBack: () => void
}

export function CoffeeShopDetail({ shop, onBack }: CoffeeShopDetailProps) {
  // Create a state to hold the current reviews including user-added ones
  const [currentReviews, setCurrentReviews] = useState<Review[]>(shop.reviews)

  // Add a state variable to track when reviews change
  const [reviewsVersion, setReviewsVersion] = useState(0)

  // Update reviews when they change in the store
  useEffect(() => {
    const userReviews = getReviews(shop.id)
    const originalReviews = shop.reviews.filter((review) => review.user !== "You")
    setCurrentReviews([...userReviews, ...originalReviews])
  }, [shop.id, shop.reviews, reviewsVersion])

  // Calculate the average rating from all reviews
  const averageRating = useMemo(() => {
    if (currentReviews.length === 0) return shop.rating

    const totalRating = currentReviews.reduce((sum, review) => sum + review.rating, 0)
    return totalRating / currentReviews.length
  }, [currentReviews, shop.rating])

  // Handler for review changes
  const handleReviewChange = () => {
    setReviewsVersion((prev) => prev + 1)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="group flex items-center gap-2 mb-4 ml-6 mt-6 pl-2 text-primary hover:bg-muted hover:text-primary overflow-hidden"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-[-4px]" />
            Back to list
          </Button>

          <div className="relative h-64 md:h-[400px] overflow-hidden">
            <Image
              src={shop.image || "/placeholder.svg?height=800&width=1200"}
              alt={`${shop.name} coffee shop`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground">
                <Coffee className="h-3 w-3 mr-1" />
                Coffee Shop
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl font-bold text-white mb-2">{shop.name}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-white">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500 mr-1" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-white/80 ml-1">({currentReviews.length} reviews)</span>
                </div>
                <div className="flex items-center text-white/80">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{shop.location.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Mobile layout: Reorder sections */}
            <div className="md:hidden space-y-4 mb-6">
              <div className="rounded-lg bg-card p-4 shadow-sm">
                <h3 className="font-medium mb-3 text-primary">Hours</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {shop.hours.open} - {shop.hours.close}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-card p-4 shadow-sm">
                <h3 className="font-medium mb-3 text-primary">Location</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>{shop.location.address}</p>
                  <p>
                    {shop.location.city}, {shop.location.state} {shop.location.zip}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-card p-4 shadow-sm">
                <h3 className="font-medium mb-3 text-primary">Contact</h3>
                <Button
                  variant="default"
                  className="w-full transition-all active:scale-[0.98]"
                  onClick={() => {
                    toast.success("Coffee Shop Contact", {
                      description: (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-amber-500" />
                          <span>
                            Contact <span className="font-semibold text-amber-500">555-123-4567</span>
                          </span>
                        </div>
                      ),
                      action: {
                        label: "Dismiss",
                        onClick: () => {},
                      },
                    })
                  }}
                >
                  Call Now
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {shop.amenities.wifi && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  WiFi
                </Badge>
              )}
              {shop.amenities.seating && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Seating
                </Badge>
              )}
              {shop.amenities.powerOutlets && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Power className="h-3 w-3" />
                  Power Outlets
                </Badge>
              )}
              {shop.amenities.quietSpace && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <VolumeX className="h-3 w-3" />
                  Quiet Space
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{shop.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 bg-muted">
                    <TabsTrigger
                      value="info"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="map"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Map
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-primary">About {shop.name}</h3>
                      <p className="text-muted-foreground">{shop.longDescription}</p>

                      <Separator />

                      <h3 className="text-xl font-semibold text-primary">Specialties</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {shop.specialties.map((specialty, index) => (
                          <li key={index} className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            {specialty}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="map" className="mt-4">
                    <SimpleMap location={shop.location} name={shop.name} />
                    <div className="mt-4 flex justify-center">
                      <Button
                        variant="outline"
                        className="gap-2 transition-all"
                        onClick={() => {
                          // Create Google Maps URL with location coordinates
                          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${shop.location.coordinates.lat},${shop.location.coordinates.lng}`

                          // Open in new tab
                          window.open(mapUrl, "_blank", "noopener,noreferrer")

                          toast.success("Opening Maps", {
                            description: `Opening location for ${shop.name} in Google Maps`,
                          })
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in Google Maps
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-4">
                    <ReviewSection shopId={shop.id} reviews={currentReviews} onReviewChange={handleReviewChange} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Desktop layout: Show sidebar on the right */}
              <div className="hidden md:block space-y-4">
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h3 className="font-medium mb-3 text-primary">Hours</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {shop.hours.open} - {shop.hours.close}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h3 className="font-medium mb-3 text-primary">Location</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>{shop.location.address}</p>
                    <p>
                      {shop.location.city}, {shop.location.state} {shop.location.zip}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h3 className="font-medium mb-3 text-primary">Contact</h3>
                  <Button
                    variant="default"
                    className="w-full transition-all active:scale-[0.98]"
                    onClick={() => {
                      toast.success("Coffee Shop Contact", {
                        description: (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-amber-500" />
                            <span>
                              Contact <span className="font-semibold text-amber-500">555-123-4567</span>
                            </span>
                          </div>
                        ),
                        action: {
                          label: "Dismiss",
                          onClick: () => {},
                        },
                      })
                    }}
                  >
                    Call Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState } from "react"
import { Star, AlertCircle, Trash2, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Review } from "@/types/coffee-shop"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { addReview, deleteReview, getReviews } from "@/lib/review-store"

const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, {
      message: "Please select a rating",
    })
    .max(5, {
      message: "Please select a rating",
    }),
  comment: z
    .string()
    .min(5, {
      message: "Review must be at least 5 characters",
    })
    .max(500, {
      message: "Review cannot be longer than 500 characters",
    }),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

interface ReviewSectionProps {
  shopId: string
  reviews: Review[]
  onReviewChange?: () => void
}

export function ReviewSection({ shopId, reviews: initialReviews, onReviewChange }: ReviewSectionProps) {
  // Combine initial reviews with any stored user reviews
  const userReviews = getReviews(shopId).filter((review) => review.user === "You")
  const shopReviews = initialReviews.filter((review) => review.user !== "You")

  const [reviews, setReviews] = useState<Review[]>([...userReviews, ...shopReviews])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deletedReviews, setDeletedReviews] = useState<Review[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  })

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      setSubmitError(null)
      setIsSubmitting(true)

      toast.loading("Submitting review...", {
        id: "submit-review",
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const review: Review = {
        id: `review-${Date.now()}`,
        user: "You",
        rating: data.rating,
        comment: data.comment,
        date: new Date().toISOString(),
      }

      // Add to our review store
      addReview(shopId, review)

      // Update local state
      setReviews([review, ...reviews])

      // Notify parent component that reviews have changed
      if (onReviewChange) {
        onReviewChange()
      }

      form.reset({
        rating: 5,
        comment: "",
      })

      toast.success("Review submitted", {
        id: "submit-review",
        description: "Your review has been published successfully",
      })
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message)
        toast.error("Submission Failed", {
          id: "submit-review",
          description: error.message,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteDialog = (reviewId: string) => {
    setReviewToDelete(reviewId)
    setIsDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDialogOpen(false)
    setReviewToDelete(null)
  }

  const confirmDeleteReview = () => {
    if (!reviewToDelete) return

    handleDeleteReview(reviewToDelete)
    closeDeleteDialog()
  }

  const handleDeleteReview = (reviewId: string) => {
    const reviewToRemove = reviews.find((review) => review.id === reviewId)
    if (reviewToRemove) {
      const updatedDeletedReviews = [...deletedReviews, reviewToRemove]
      setDeletedReviews(updatedDeletedReviews)

      // Remove from local state
      setReviews(reviews.filter((review) => review.id !== reviewId))

      // Remove from our review store
      deleteReview(shopId, reviewId)

      // Notify parent component that reviews have changed
      if (onReviewChange) {
        onReviewChange()
      }

      toast.success("Review deleted", {
        description: "Your review has been deleted",
        action: {
          label: "Undo",
          onClick: () => {
            const lastDeleted = updatedDeletedReviews[updatedDeletedReviews.length - 1]

            // Add back to local state
            setReviews((prevReviews) =>
              [...prevReviews, lastDeleted].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            )

            // Add back to our review store
            addReview(shopId, lastDeleted)

            setDeletedReviews(updatedDeletedReviews.slice(0, -1))

            // Notify parent component that reviews have changed
            if (onReviewChange) {
              onReviewChange()
            }

            toast.success("Review restored", {
              description: "Your review has been restored successfully",
            })
          },
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#5E3A21] flex items-center gap-2">
          <Coffee className="h-5 w-5" />
          Customer Reviews
        </h3>

        <Card className="overflow-hidden bg-white shadow-sm">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 text-[#5E3A21]">Write a Review</h4>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#5E3A21]">Rating</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => field.onChange(star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  star <= field.value ? "fill-[#F9A826] text-[#F9A826]" : "text-[#E6C9A8]"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#5E3A21]">Your Review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your experience..."
                          className="min-h-[100px] resize-none border-[#E6C9A8] focus-visible:ring-[#8B5A3C]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full transition-all bg-[#5E3A21] hover:bg-[#8B5A3C] active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-[#E6C9A8]" />

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <p className="text-[#8B5A3C]">No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg bg-white p-4 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-[#E6C9A8]">
                    <AvatarFallback className="bg-[#FDF6EC] text-[#5E3A21]">{review.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#5E3A21]">{review.user}</p>
                    <p className="text-xs text-[#8B5A3C]">
                      {new Date(review.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating ? "fill-[#F9A826] text-[#F9A826]" : "text-[#E6C9A8]"
                        }`}
                      />
                    ))}
                  </div>

                  {review.user === "You" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-red-100 hover:text-red-500"
                      onClick={() => openDeleteDialog(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete review</span>
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-[#8B5A3C]">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#5E3A21]">Delete Review</DialogTitle>
            <DialogDescription className="text-[#8B5A3C]">
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              className="border-[#E6C9A8] text-[#5E3A21] hover:bg-[#FDF6EC]"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteReview}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


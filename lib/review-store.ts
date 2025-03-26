import type { Review } from "@/types/coffee-shop"

// Define a type for our review store
export type ReviewStore = {
  [shopId: string]: Review[]
}

// Initialize the store
let reviewStore: ReviewStore = {}

// Function to get all reviews for a shop
export function getReviews(shopId: string): Review[] {
  return reviewStore[shopId] || []
}

// Function to add a review
export function addReview(shopId: string, review: Review): void {
  if (!reviewStore[shopId]) {
    reviewStore[shopId] = []
  }

  // Check if review already exists to avoid duplicates
  const exists = reviewStore[shopId].some((r) => r.id === review.id)
  if (!exists) {
    reviewStore[shopId] = [review, ...reviewStore[shopId]]

    // Also update the window store for redundancy
    if (typeof window !== "undefined") {
      if (!window.__REVIEW_STORE) {
        window.__REVIEW_STORE = {}
      }
      if (!window.__REVIEW_STORE[shopId]) {
        window.__REVIEW_STORE[shopId] = []
      }
      window.__REVIEW_STORE[shopId] = [review, ...window.__REVIEW_STORE[shopId]]
    }
  }
}

// Function to delete a review
export function deleteReview(shopId: string, reviewId: string): void {
  if (reviewStore[shopId]) {
    reviewStore[shopId] = reviewStore[shopId].filter((review) => review.id !== reviewId)

    // Also update the window store for redundancy
    if (typeof window !== "undefined" && window.__REVIEW_STORE && window.__REVIEW_STORE[shopId]) {
      window.__REVIEW_STORE[shopId] = window.__REVIEW_STORE[shopId].filter((review) => review.id !== reviewId)
    }
  }
}

// Function to initialize the store from window.__REVIEW_STORE if it exists
export function initializeFromWindow(): void {
  if (typeof window !== "undefined" && window.__REVIEW_STORE) {
    reviewStore = { ...window.__REVIEW_STORE }
  }
}

// Function to sync the window store with our store
export function syncToWindow(): void {
  if (typeof window !== "undefined") {
    window.__REVIEW_STORE = { ...reviewStore }
  }
}

// Extend Window interface
declare global {
  interface Window {
    __REVIEW_STORE: ReviewStore
  }
}


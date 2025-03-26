export interface Location {
  address: string
  city: string
  state: string
  zip: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Review {
  id: string
  user: string
  rating: number
  comment: string
  date: string
}

export interface CoffeeShop {
  id: string
  name: string
  description: string
  longDescription: string
  image: string
  rating: number
  location: Location
  hours: {
    open: string
    close: string
  }
  amenities: {
    wifi: boolean
    seating: boolean
    powerOutlets: boolean
    quietSpace: boolean
  }
  specialties: string[]
  reviews: Review[]
}


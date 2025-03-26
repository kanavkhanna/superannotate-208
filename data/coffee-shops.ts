import type { CoffeeShop } from "@/types/coffee-shop"

export const coffeeShops: CoffeeShop[] = [
  {
    id: "1",
    name: "Brew Haven",
    description: "A cozy spot with artisanal coffee and homemade pastries.",
    longDescription:
      "Brew Haven is a locally-owned coffee shop that specializes in ethically sourced, single-origin coffee beans. Our baristas are trained to perfect the art of coffee making, ensuring each cup is crafted to perfection. The rustic interior with comfortable seating makes it an ideal place for both work and relaxation.",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.7,
    location: {
      address: "123 Coffee Lane",
      city: "Portland",
      state: "OR",
      zip: "97201",
      coordinates: { lat: 45.523064, lng: -122.676483 },
    },
    hours: {
      open: "7:00 AM",
      close: "8:00 PM",
    },
    amenities: {
      wifi: true,
      seating: true,
      powerOutlets: true,
      quietSpace: false,
    },
    specialties: ["Pour-over coffee", "Espresso drinks", "Homemade pastries", "Vegan options"],
    reviews: [
      {
        id: "r1",
        user: "Coffee Lover",
        rating: 5,
        comment: "Best latte in town! The atmosphere is perfect for getting work done.",
        date: "2023-10-15T14:48:00.000Z",
      },
      {
        id: "r2",
        user: "Morning Person",
        rating: 4,
        comment: "Great coffee and friendly staff. Gets a bit crowded on weekends.",
        date: "2023-09-28T09:23:00.000Z",
      },
    ],
  },
  {
    id: "2",
    name: "Urban Grind",
    description: "Modern coffee shop with specialty drinks and fast WiFi.",
    longDescription:
      "Urban Grind is a contemporary coffee shop designed for the modern coffee enthusiast. We offer a wide range of specialty drinks, from classic espresso to innovative seasonal creations. Our space features modern design elements, plenty of outlets, and high-speed WiFi, making it perfect for remote workers and students.",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.5,
    location: {
      address: "456 Main Street",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      coordinates: { lat: 47.608013, lng: -122.335167 },
    },
    hours: {
      open: "6:30 AM",
      close: "9:00 PM",
    },
    amenities: {
      wifi: true,
      seating: true,
      powerOutlets: true,
      quietSpace: true,
    },
    specialties: ["Cold brew", "Specialty lattes", "Breakfast sandwiches", "Gluten-free options"],
    reviews: [
      {
        id: "r3",
        user: "Tech Worker",
        rating: 5,
        comment: "Perfect spot for remote work. Fast WiFi and great coffee!",
        date: "2023-10-10T16:30:00.000Z",
      },
      {
        id: "r4",
        user: "Coffee Snob",
        rating: 4,
        comment: "Their espresso is excellent. The cold brew could be stronger.",
        date: "2023-09-15T11:45:00.000Z",
      },
      {
        id: "r5",
        user: "Weekend Visitor",
        rating: 5,
        comment: "Love the atmosphere and the seasonal drinks are always creative!",
        date: "2023-08-22T14:20:00.000Z",
      },
    ],
  },
  {
    id: "3",
    name: "Café Solace",
    description: "Quiet café with garden seating and organic coffee options.",
    longDescription:
      "Café Solace offers a peaceful retreat from the busy city life. Our garden seating area is surrounded by plants and flowers, creating a tranquil environment for enjoying your coffee. We pride ourselves on serving organic, fair-trade coffee and tea, along with a selection of healthy food options made from locally sourced ingredients.",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.8,
    location: {
      address: "789 Garden Road",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    hours: {
      open: "8:00 AM",
      close: "7:00 PM",
    },
    amenities: {
      wifi: true,
      seating: true,
      powerOutlets: false,
      quietSpace: true,
    },
    specialties: ["Organic coffee", "Herbal teas", "Vegetarian lunch options", "Homemade desserts"],
    reviews: [
      {
        id: "r6",
        user: "Nature Lover",
        rating: 5,
        comment: "The garden seating is magical! So peaceful and the organic coffee is delicious.",
        date: "2023-10-05T13:15:00.000Z",
      },
      {
        id: "r7",
        user: "Book Reader",
        rating: 5,
        comment: "My favorite place to read and enjoy a quiet afternoon. The herbal teas are exceptional.",
        date: "2023-09-18T15:30:00.000Z",
      },
    ],
  },
  {
    id: "4",
    name: "Espresso Express",
    description: "Fast-service coffee shop with drive-through and quality espresso.",
    longDescription:
      "Espresso Express combines speed with quality. Our drive-through service is designed for coffee lovers on the go, without compromising on taste. We use a special blend of beans for our espresso, creating a rich and bold flavor that stands out even in milk-based drinks. Inside, we offer limited seating for those who want to stay a while.",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.2,
    location: {
      address: "321 Highway Avenue",
      city: "Austin",
      state: "TX",
      zip: "78701",
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    hours: {
      open: "5:30 AM",
      close: "8:00 PM",
    },
    amenities: {
      wifi: false,
      seating: true,
      powerOutlets: false,
      quietSpace: false,
    },
    specialties: ["Quick service espresso", "Drive-through coffee", "Breakfast tacos", "Iced coffee drinks"],
    reviews: [
      {
        id: "r8",
        user: "Early Riser",
        rating: 4,
        comment: "Great for my morning commute. Fast service and consistent quality.",
        date: "2023-10-12T07:45:00.000Z",
      },
      {
        id: "r9",
        user: "Espresso Fan",
        rating: 5,
        comment: "Best quick espresso in town! The drive-through is super efficient.",
        date: "2023-09-30T16:20:00.000Z",
      },
      {
        id: "r10",
        user: "Busy Parent",
        rating: 4,
        comment: "Lifesaver for busy mornings. Kids love their hot chocolate too!",
        date: "2023-09-05T08:30:00.000Z",
      },
    ],
  },
  {
    id: "5",
    name: "The Coffee Library",
    description: "Book-themed coffee shop with extensive tea selection and reading nooks.",
    longDescription:
      "The Coffee Library combines the love of reading with the pleasure of good coffee. Our space is designed with cozy reading nooks, bookshelves filled with books for customers to enjoy, and soft lighting to create the perfect reading atmosphere. We offer an extensive selection of coffee and tea, as well as light snacks that won't distract from your reading experience.",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.9,
    location: {
      address: "567 Bookworm Lane",
      city: "Boston",
      state: "MA",
      zip: "02108",
      coordinates: { lat: 42.3601, lng: -71.0589 },
    },
    hours: {
      open: "7:30 AM",
      close: "10:00 PM",
    },
    amenities: {
      wifi: true,
      seating: true,
      powerOutlets: true,
      quietSpace: true,
    },
    specialties: ["Literary-themed drinks", "Rare tea collection", "Book club meetings", "Author events"],
    reviews: [
      {
        id: "r11",
        user: "Bookworm",
        rating: 5,
        comment: "Heaven for book lovers! I spent hours here reading and enjoying their amazing tea selection.",
        date: "2023-10-08T14:00:00.000Z",
      },
      {
        id: "r12",
        user: "Writer",
        rating: 5,
        comment: "My favorite place to write. The quiet atmosphere and excellent coffee keep me coming back.",
        date: "2023-09-25T11:15:00.000Z",
      },
      {
        id: "r13",
        user: "Tea Enthusiast",
        rating: 5,
        comment: "Their tea collection is impressive! The reading nooks are so comfortable and well-designed.",
        date: "2023-09-10T16:45:00.000Z",
      },
    ],
  },
  {
    id: "6",
    name: "Mountain Brew",
    description: "Rustic coffee house with mountain views and locally roasted beans.",
    longDescription:
      "Mountain Brew offers a rustic coffee experience with spectacular views of the nearby mountains. We roast our beans on-site, allowing customers to enjoy the freshest coffee possible. Our rustic interior features wooden furniture, a stone fireplace, and large windows that showcase the natural beauty surrounding us. We're known for our signature mountain blends and hearty breakfast options that fuel hikers and outdoor enthusiasts.",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.6,
    location: {
      address: "890 Summit Road",
      city: "Denver",
      state: "CO",
      zip: "80202",
      coordinates: { lat: 39.7392, lng: -104.9903 },
    },
    hours: {
      open: "6:00 AM",
      close: "7:00 PM",
    },
    amenities: {
      wifi: true,
      seating: true,
      powerOutlets: true,
      quietSpace: false,
    },
    specialties: [
      "House-roasted beans",
      "Mountain blend coffee",
      "Hearty breakfast options",
      "Outdoor seating with views",
    ],
    reviews: [
      {
        id: "r14",
        user: "Hiker",
        rating: 5,
        comment: "Perfect spot after a morning hike! The mountain views and fresh coffee are unbeatable.",
        date: "2023-10-02T10:30:00.000Z",
      },
      {
        id: "r15",
        user: "Coffee Roaster Fan",
        rating: 4,
        comment: "Love watching them roast the beans. You can really taste the freshness!",
        date: "2023-09-20T09:15:00.000Z",
      },
    ],
  },
]


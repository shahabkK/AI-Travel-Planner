export interface PopularDestination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  suggestedBudget: number;
  suggestedDays: number;
  image: string;
  rating: number;
  tags: string[];
}

export const POPULAR_DESTINATIONS: PopularDestination[] = [
  {
    id: "dest_paris",
    name: "Paris",
    country: "France",
    tagline: "The City of Light, art, romance, and gourmet gastronomy",
    suggestedBudget: 1200,
    suggestedDays: 5,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tags: ["Culture", "Food", "Museums", "Romance"],
  },
  {
    id: "dest_tokyo",
    name: "Tokyo",
    country: "Japan",
    tagline: "Futuristic neon skyscrapers meets ancient historic temples",
    suggestedBudget: 1400,
    suggestedDays: 6,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tags: ["Tech", "Food", "Anime", "Temples"],
  },
  {
    id: "dest_bali",
    name: "Bali",
    country: "Indonesia",
    tagline: "Tropical island paradise with rice terraces and surf beaches",
    suggestedBudget: 750,
    suggestedDays: 7,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tags: ["Beaches", "Nature", "Relaxation", "Adventure"],
  },
  {
    id: "dest_rome",
    name: "Rome",
    country: "Italy",
    tagline: "An open-air museum of ancient gladiators, gelatos, and piazzas",
    suggestedBudget: 1100,
    suggestedDays: 4,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tags: ["History", "Architecture", "Food", "Gelato"],
  },
  {
    id: "dest_nyc",
    name: "New York",
    country: "United States",
    tagline: "The energetic city that never sleeps, Broadway, and Central Park",
    suggestedBudget: 1600,
    suggestedDays: 5,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tags: ["Shopping", "Nightlife", "Broadway", "Museums"],
  },
  {
    id: "dest_kyoto",
    name: "Kyoto",
    country: "Japan",
    tagline: "Serene bamboo groves, traditional geisha districts, and teahouses",
    suggestedBudget: 1100,
    suggestedDays: 4,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tags: ["Heritage", "Nature", "Zen", "Culture"],
  },
  {
    id: "dest_barcelona",
    name: "Barcelona",
    country: "Spain",
    tagline: "Gaudí architectural marvels, Mediterranean beaches, and tapas",
    suggestedBudget: 950,
    suggestedDays: 5,
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    tags: ["Beaches", "Architecture", "Tapas", "Nightlife"],
  },
  {
    id: "dest_dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    tagline: "Luxury shopping, ultra-modern skyscrapers, and desert safaris",
    suggestedBudget: 1800,
    suggestedDays: 5,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    tags: ["Luxury", "Desert", "Shopping", "Family"],
  },
];

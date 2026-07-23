export interface User {
  uid: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
}

export type TravelType = 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
export type TransportationType = 'Flight' | 'Bus' | 'Train' | 'Car';
export type AccommodationType = 'Hotel' | 'Hostel' | 'Apartment' | 'Resort';

export interface TripPreferences {
  destination: string;
  budget: number;
  currency: string;
  duration: number; // in days
  travelType: TravelType;
  transportation: TransportationType;
  accommodation: AccommodationType;
  interests: string[];
  dietary?: string;
  pacing?: 'Relaxed' | 'Balanced' | 'Fast-Paced';
  additionalNotes?: string;
}

export interface Hotel {
  id: string;
  name: string;
  price: string;
  pricePerNight: number;
  rating: number;
  address: string;
  distance: string;
  googleMapsUrl: string;
  description: string;
  amenities: string[];
  image: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: string;
  description: string;
  distance: string;
  rating: number;
  openHours: string;
  estimatedCost: string;
  image: string;
  googleMapsUrl: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Street Food' | 'Coffee' | 'Vegetarian';
  priceRange: string;
  rating: number;
  mustTry: string;
  address: string;
}

export interface ItineraryTimeSlot {
  title: string;
  description: string;
  location?: string;
  cost?: string;
  timeSlot?: string;
  category?: 'sightseeing' | 'dining' | 'activity' | 'relax';
}

export interface DailyItineraryDay {
  dayNumber: number;
  theme: string;
  morning: ItineraryTimeSlot;
  afternoon: ItineraryTimeSlot;
  evening: ItineraryTimeSlot;
  night?: ItineraryTimeSlot;
  dailyTips: string;
  estimatedDayBudget: number;
}

export interface BudgetCategory {
  category: 'Hotel' | 'Food' | 'Transport' | 'Shopping' | 'Activities' | 'Emergency';
  amount: number;
  percentage: number;
  description: string;
}

export interface PackingItem {
  id: string;
  category: 'Essentials' | 'Clothing' | 'Electronics' | 'Toiletries' | 'Weather Specific' | 'Health';
  item: string;
  checked: boolean;
  isRequired: boolean;
}

export interface ForecastDay {
  day: string;
  tempMaxC: number;
  tempMinC: number;
  condition: string;
  icon: string;
}

export interface WeatherInfo {
  tempC: number;
  tempF: number;
  condition: string;
  humidity: number;
  windKmH: number;
  rainChance: number;
  forecast: ForecastDay[];
  packingAdvice: string;
}

export interface EmergencyContact {
  name: string;
  address: string;
  phone: string;
}

export interface EmergencyInfo {
  hospitals: EmergencyContact[];
  police: EmergencyContact[];
  embassies: EmergencyContact[];
  airport: { name: string; code: string; distance: string };
  generalEmergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    touristHelpline: string;
  };
}

export interface LocalPhrase {
  english: string;
  local: string;
  pronunciation: string;
  category: 'Greetings' | 'Dining' | 'Directions' | 'Emergency' | 'Shopping';
}

export interface SafetyAdvice {
  overallScore: number;
  advisoryLevel: 'Low Risk' | 'Exercise Caution' | 'High Vigilance';
  safetyTips: string[];
  scamsToAvoid: string[];
  safeNeighborhoods: string[];
  areasToExerciseCaution: string[];
}

export interface TripPlan {
  id: string;
  destination: string;
  country: string;
  title: string;
  summary: string;
  createdAt: string;
  userUid?: string;
  preferences: TripPreferences;
  totalBudgetEstimated: number;
  currency: string;
  language: string;
  bestTimeToVisit: string;
  localTransportGuide: string;
  customsAndEtiquette: string[];
  budgetBreakdown: BudgetCategory[];
  budgetOptimizationTips: string[];
  hotels: Hotel[];
  attractions: Attraction[];
  restaurants: Restaurant[];
  dailyItinerary: DailyItineraryDay[];
  packingList: PackingItem[];
  weather: WeatherInfo;
  emergency: EmergencyInfo;
  phrases: LocalPhrase[];
  safety: SafetyAdvice;
  isFavorite?: boolean;
  coverImage: string;
}

export interface ExpenseItem {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  category: 'Hotel' | 'Food' | 'Transport' | 'Shopping' | 'Activities' | 'Other';
  date: string;
}

export interface DestinationComparisonDetails {
  name: string;
  country: string;
  estCost: number;
  bestFor: string;
  weather: string;
  pros: string[];
  cons: string[];
  safetyScore: number;
  vibe: string;
}

export interface TripComparisonResult {
  dest1: DestinationComparisonDetails;
  dest2: DestinationComparisonDetails;
  winnerVerdict: string;
  comparisonSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

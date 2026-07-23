import { User, TripPlan, ExpenseItem } from "../types";

const USER_KEY = "tripgenius_user";
const TRIPS_KEY = "tripgenius_saved_trips";
const EXPENSES_KEY = "tripgenius_expenses";
const DARK_MODE_KEY = "tripgenius_dark_mode";

// Sample initial user
export const DEFAULT_USER: User = {
  uid: "usr_default_123",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  createdAt: new Date().toISOString(),
};

// Initial default demo trips so the dashboard looks rich right away
export const SAMPLE_TRIPS: TripPlan[] = [
  {
    id: "sample_paris_1",
    destination: "Paris",
    country: "France",
    title: "Enchanting 5-Day Paris Getaway",
    summary: "Discover iconic landmarks, world-class art at the Louvre, romantic Seine cruises, and charming Montmartre cafes.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    preferences: {
      destination: "Paris",
      budget: 1200,
      currency: "$",
      duration: 5,
      travelType: "Couple",
      transportation: "Flight",
      accommodation: "Hotel",
      interests: ["Food", "Museums", "Historical Places"],
      pacing: "Balanced",
    },
    totalBudgetEstimated: 1200,
    currency: "$",
    language: "French",
    bestTimeToVisit: "April to May, September to October",
    localTransportGuide: "Use the Paris Métro with a Navigo Easy pass or carnet tickets. Walking is wonderful along the Seine.",
    customsAndEtiquette: [
      "Always greet shopkeepers with 'Bonjour'",
      "Keep voice low on public transit",
      "Tipping is modest (rounding up is standard)",
    ],
    budgetBreakdown: [
      { category: "Hotel", amount: 450, percentage: 37.5, description: "Boutique hotel in 10th Arrondissement" },
      { category: "Food", amount: 300, percentage: 25, description: "Bistros, bakeries, & wine bars" },
      { category: "Transport", amount: 100, percentage: 8.3, description: "Metro pass & airport RER train" },
      { category: "Activities", amount: 200, percentage: 16.7, description: "Louvre, Eiffel Tower, Orsay Museum" },
      { category: "Shopping", amount: 100, percentage: 8.3, description: "Souvenirs & local delicacies" },
      { category: "Emergency", amount: 50, percentage: 4.2, description: "Contingency fund" },
    ],
    budgetOptimizationTips: [
      "Buy the Paris Museum Pass for free skip-the-line entry to over 50 attractions.",
      "Enjoy lunch menus ('Formule du midi') which offer 3-course meals at half the dinner price.",
      "Grab fresh baguettes and cheeses for a scenic picnic along Champ de Mars.",
    ],
    hotels: [
      {
        id: "h_paris_1",
        name: "Hotel Opera Maintenon",
        price: "$120/night",
        pricePerNight: 120,
        rating: 4.6,
        address: "12 Rue Saint-Augustin, 75002 Paris",
        distance: "1.2 km from Louvre Museum",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Opera+Maintenon+Paris",
        description: "Cozy Parisian hotel with charming décor located near Opera Garnier and Metro stations.",
        amenities: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included", "24/7 Front Desk"],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "h_paris_2",
        name: "CitizenM Paris Gare de Lyon",
        price: "$145/night",
        pricePerNight: 145,
        rating: 4.7,
        address: "8 Rue Van Gogh, 75012 Paris",
        distance: "2.1 km from Notre-Dame",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=CitizenM+Paris+Gare+de+Lyon",
        description: "Modern stylish rooms with smart mood lighting and rooftop views over the Seine.",
        amenities: ["Rooftop Bar", "High-speed Wi-Fi", "Rain Showers", "Express Check-in"],
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
      },
    ],
    attractions: [
      {
        id: "attr_p_1",
        name: "Eiffel Tower & Champ de Mars",
        category: "Iconic Landmark",
        description: "The world-famous iron lattice tower offering breathtaking panoramic views across Paris.",
        distance: "Center",
        rating: 4.8,
        openHours: "09:30 AM - 11:45 PM",
        estimatedCost: "$30 entrance ticket",
        image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Eiffel+Tower+Paris",
      },
      {
        id: "attr_p_2",
        name: "Louvre Museum",
        category: "Art & History",
        description: "The world's largest museum housing the Mona Lisa, Venus de Milo, and thousands of masterpieces.",
        distance: "1.5 km",
        rating: 4.9,
        openHours: "09:00 AM - 06:00 PM (Closed Tue)",
        estimatedCost: "$22 ticket",
        image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Louvre+Museum+Paris",
      },
      {
        id: "attr_p_3",
        name: "Musée d'Orsay",
        category: "Art Museum",
        description: "Fabulous Impressionist art collection inside a converted Beaux-Arts railway station.",
        distance: "2.0 km",
        rating: 4.8,
        openHours: "09:30 AM - 06:00 PM",
        estimatedCost: "$18 ticket",
        image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Musee+d+Orsay+Paris",
      },
    ],
    restaurants: [
      {
        id: "rest_p_1",
        name: "Le Petit Marché",
        cuisine: "French Bistro",
        mealType: "Dinner",
        priceRange: "$$ ($25 - $40)",
        rating: 4.7,
        mustTry: "Duck breast with honey & spices",
        address: "9 Rue de Béarn, 75003 Paris",
      },
      {
        id: "rest_p_2",
        name: "Du Pain et des Idées",
        cuisine: "Artisan Bakery",
        mealType: "Breakfast",
        priceRange: "$ ($5 - $12)",
        rating: 4.9,
        mustTry: "Pistachio Chocolate Escargot Pastry",
        address: "34 Rue Yves Toudic, 75010 Paris",
      },
    ],
    dailyItinerary: [
      {
        dayNumber: 1,
        theme: "Arrival & Eiffel Tower Illumination",
        morning: { title: "Hotel Check-in & Neighborhood Walk", description: "Settle into your hotel, grab a fresh croissant at a local boulangerie, and get acquainted with the neighborhood.", timeSlot: "09:00 AM - 12:00 PM" },
        afternoon: { title: "Stroll along Champ de Mars & Trocadéro", description: "Walk around Trocadéro gardens for the best photography angles of the Eiffel Tower.", timeSlot: "02:00 PM - 05:00 PM" },
        evening: { title: "Eiffel Tower Ascent & Dinner", description: "Take the lift to the summit for twilight views, followed by dinner at a traditional nearby bistro.", timeSlot: "06:30 PM - 10:00 PM" },
        dailyTips: "Pre-book Eiffel Tower tickets online to skip the 2-hour general line.",
        estimatedDayBudget: 140,
      },
      {
        dayNumber: 2,
        theme: "World-Class Art & Seine River Sunset Cruise",
        morning: { title: "Louvre Museum Highlights Tour", description: "Explore the Denon Wing for the Mona Lisa, Winged Victory, and Italian Renaissance art.", timeSlot: "09:00 AM - 01:00 PM" },
        afternoon: { title: "Tuileries Garden & Place Vendôme", description: "Stroll through the royal Tuileries Gardens and enjoy hot chocolate at Angelina Paris.", timeSlot: "02:30 PM - 05:00 PM" },
        evening: { title: "Evening Seine River Boat Cruise", description: "Relax on an open-top Bateaux Parisiens cruise passing lit monuments.", timeSlot: "07:00 PM - 09:30 PM" },
        dailyTips: "Angelina's hot chocolate is extremely thick and rich—one cup is great to share!",
        estimatedDayBudget: 110,
      },
    ],
    packingList: [
      { id: "p1", category: "Essentials", item: "Passport & Visa Documents", checked: true, isRequired: true },
      { id: "p2", category: "Essentials", item: "Credit Cards & Euros (Euros in cash)", checked: true, isRequired: true },
      { id: "p3", category: "Electronics", item: "Type C/E Universal Adapter", checked: false, isRequired: true },
      { id: "p4", category: "Clothing", item: "Comfortable Walking Shoes", checked: false, isRequired: true },
      { id: "p5", category: "Weather Specific", item: "Compact Umbrella", checked: false, isRequired: false },
    ],
    weather: {
      tempC: 21,
      tempF: 70,
      condition: "Partly Sunny",
      humidity: 55,
      windKmH: 12,
      rainChance: 15,
      packingAdvice: "Pleasant mild weather. Bring a light trench coat or cardigan for crisp evenings.",
      forecast: [
        { day: "Day 1", tempMaxC: 22, tempMinC: 14, condition: "Sunny", icon: "sun" },
        { day: "Day 2", tempMaxC: 21, tempMinC: 13, condition: "Partly Cloudy", icon: "cloud-sun" },
        { day: "Day 3", tempMaxC: 19, tempMinC: 12, condition: "Passing Showers", icon: "cloud-rain" },
        { day: "Day 4", tempMaxC: 23, tempMinC: 15, condition: "Clear Sky", icon: "sun" },
        { day: "Day 5", tempMaxC: 22, tempMinC: 14, condition: "Sunny", icon: "sun" },
      ],
    },
    emergency: {
      hospitals: [{ name: "Hôpital Lariboisière", address: "2 Rue Ambroise Paré, 75010 Paris", phone: "+33 1 49 95 65 65" }],
      police: [{ name: "Commissariat de Police 10e", address: "26 Rue de Louis Blanc, Paris", phone: "+33 1 53 72 26 00" }],
      embassies: [{ name: "US Embassy in Paris", address: "2 Avenue Gabriel, 75008 Paris", phone: "+33 1 43 12 22 22" }],
      airport: { name: "Charles de Gaulle Airport (CDG)", code: "CDG", distance: "28 km" },
      generalEmergencyNumbers: { police: "17", ambulance: "15", fire: "18", touristHelpline: "+33 1 49 52 53 54" },
    },
    phrases: [
      { english: "Hello / Good Day", local: "Bonjour", pronunciation: "bon-zhoor", category: "Greetings" },
      { english: "Thank you very much", local: "Merci beaucoup", pronunciation: "mair-see boh-koo", category: "Greetings" },
      { english: "Where is the bathroom?", local: "Où sont les toilettes?", pronunciation: "oo son lay twah-let", category: "Directions" },
      { english: "Check please", local: "L'addition s'il vous plaît", pronunciation: "lah-dee-syon seel voo play", category: "Dining" },
    ],
    safety: {
      overallScore: 90,
      advisoryLevel: "Low Risk",
      safetyTips: ["Beware of pickpockets around Sacré-Cœur stairs and Metro line 1.", "Never sign street petitions from strangers."],
      scamsToAvoid: ["The 'Friendship Bracelet' ring scam", "Found gold ring trick"],
      safeNeighborhoods: ["Le Marais", "Latin Quarter", "Saint-Germain-des-Prés"],
      areasToExerciseCaution: ["Gare du Nord late at night"],
    },
    isFavorite: true,
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getUser(): User {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_USER;
}

export function saveUser(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
}

export function getSavedTrips(): TripPlan[] {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return SAMPLE_TRIPS;
}

export function saveTrips(trips: TripPlan[]): void {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error(e);
  }
}

export function saveTripPlan(trip: TripPlan): TripPlan[] {
  const current = getSavedTrips();
  const existingIndex = current.findIndex((t) => t.id === trip.id);
  let updated: TripPlan[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = trip;
  } else {
    updated = [trip, ...current];
  }
  saveTrips(updated);
  return updated;
}

export function deleteTripPlan(tripId: string): TripPlan[] {
  const current = getSavedTrips();
  const filtered = current.filter((t) => t.id !== tripId);
  saveTrips(filtered);
  return filtered;
}

export function toggleFavoriteTrip(tripId: string): TripPlan[] {
  const current = getSavedTrips();
  const updated = current.map((t) => {
    if (t.id === tripId) {
      return { ...t, isFavorite: !t.isFavorite };
    }
    return t;
  });
  saveTrips(updated);
  return updated;
}

export function getExpensesByTrip(tripId: string): ExpenseItem[] {
  try {
    const raw = localStorage.getItem(`${EXPENSES_KEY}_${tripId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [
    { id: "e1", tripId, title: "Metro Pass", amount: 25, category: "Transport", date: "Day 1" },
    { id: "e2", tripId, title: "Welcome Dinner Bistro", amount: 65, category: "Food", date: "Day 1" },
  ];
}

export function saveExpensesForTrip(tripId: string, expenses: ExpenseItem[]): void {
  try {
    localStorage.setItem(`${EXPENSES_KEY}_${tripId}`, JSON.stringify(expenses));
  } catch (e) {
    console.error(e);
  }
}

export function getDarkMode(): boolean {
  try {
    const raw = localStorage.getItem(DARK_MODE_KEY);
    if (raw !== null) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return false;
}

export function saveDarkMode(isDark: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDark));
  } catch (e) {
    console.error(e);
  }
}

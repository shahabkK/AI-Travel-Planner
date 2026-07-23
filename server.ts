import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper for image URLs by destination query
function getUnsplashCoverImage(destination: string, type: string = "travel"): string {
  const cleanDest = encodeURIComponent(destination.trim());
  return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80`;
}

// Destination fallback image keywords map
const DESTINATION_IMAGES: Record<string, string> = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  swiss: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
};

function getDestinationCover(destination: string): string {
  const key = destination.toLowerCase().replace(/[^a-z]/g, "");
  for (const [k, url] of Object.entries(DESTINATION_IMAGES)) {
    if (key.includes(k)) return url;
  }
  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "TripGenius AI" });
});

// API endpoint: Generate Complete AI Trip Plan
app.post("/api/generate-trip", async (req, res) => {
  try {
    const preferences = req.body;
    const {
      destination = "Paris",
      budget = 1000,
      currency = "$",
      duration = 5,
      travelType = "Solo",
      transportation = "Flight",
      accommodation = "Hotel",
      interests = ["Food", "Culture", "Sightseeing"],
      dietary = "",
      pacing = "Balanced",
      additionalNotes = "",
    } = preferences;

    const systemPrompt = `You are TripGenius AI, an expert travel planner.
Generate a comprehensive, realistic, high quality, personalized travel plan for a ${duration}-day trip to "${destination}".
Target budget: ${currency}${budget}.
Travel style: ${travelType}, Transport: ${transportation}, Stay: ${accommodation}, Pacing: ${pacing}.
Interests: ${interests.join(", ")}.
Dietary constraints: ${dietary || "None"}.
Special requests: ${additionalNotes || "None"}.

Requirements:
1. Provide a clear title, country, overall summary, estimated total budget in ${currency}, best time to visit, official language, local transportation guide, customs/etiquette.
2. Break down budget into categories: Hotel, Food, Transport, Shopping, Activities, Emergency. Sum should equal around ${budget}.
3. Provide 3-4 budget optimization tips tailored to this trip.
4. Recommend 3-4 realistic hotel/stay options matching "${accommodation}" with approximate price/night in ${currency}, ratings, distance to center, amenities, and brief description.
5. Recommend 5 top attractions with categories, open hours, estimated entrance cost, ratings, description, and distance.
6. Recommend 5 authentic food & restaurant spots (Breakfast, Lunch, Dinner, Street Food, Coffee) with signature dishes and price ranges.
7. Provide a day-by-day itinerary for ALL ${duration} days. Each day must have a theme, morning, afternoon, evening activities with descriptions, time slots, locations, and estimated costs.
8. Generate a smart packing list categorized into Essentials, Clothing, Electronics, Toiletries, Weather Specific, and Health.
9. Provide current & 5-day weather forecast expectations for ${destination}.
10. Provide local emergency information (hospitals, police, embassy, airport, emergency numbers).
11. Provide 6 essential local phrases with native/local text, English translation, and phonetic pronunciation guide.
12. Provide travel safety advisor with safety score (out of 100), advisory level, safety tips, common scams to avoid, and safe neighborhoods.

Return JSON strictly matching the schema.`;

    const promptText = `Generate a complete ${duration}-day trip plan for ${destination}. Budget: ${currency}${budget}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            country: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            totalBudgetEstimated: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            language: { type: Type.STRING },
            bestTimeToVisit: { type: Type.STRING },
            localTransportGuide: { type: Type.STRING },
            customsAndEtiquette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            budgetBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  percentage: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                },
                required: ["category", "amount", "percentage", "description"],
              },
            },
            budgetOptimizationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            hotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.STRING },
                  pricePerNight: { type: Type.NUMBER },
                  rating: { type: Type.NUMBER },
                  address: { type: Type.STRING },
                  distance: { type: Type.STRING },
                  description: { type: Type.STRING },
                  amenities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["name", "price", "rating", "address", "distance", "description", "amenities"],
              },
            },
            attractions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  distance: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  openHours: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                },
                required: ["name", "category", "description", "rating", "openHours"],
              },
            },
            restaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  mealType: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  mustTry: { type: Type.STRING },
                  address: { type: Type.STRING },
                },
                required: ["name", "cuisine", "mealType", "priceRange", "rating", "mustTry"],
              },
            },
            dailyItinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.NUMBER },
                  theme: { type: Type.STRING },
                  morning: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      location: { type: Type.STRING },
                      cost: { type: Type.STRING },
                      timeSlot: { type: Type.STRING },
                    },
                    required: ["title", "description"],
                  },
                  afternoon: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      location: { type: Type.STRING },
                      cost: { type: Type.STRING },
                      timeSlot: { type: Type.STRING },
                    },
                    required: ["title", "description"],
                  },
                  evening: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      location: { type: Type.STRING },
                      cost: { type: Type.STRING },
                      timeSlot: { type: Type.STRING },
                    },
                    required: ["title", "description"],
                  },
                  dailyTips: { type: Type.STRING },
                  estimatedDayBudget: { type: Type.NUMBER },
                },
                required: ["dayNumber", "theme", "morning", "afternoon", "evening"],
              },
            },
            packingList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  item: { type: Type.STRING },
                  isRequired: { type: Type.BOOLEAN },
                },
                required: ["category", "item"],
              },
            },
            weather: {
              type: Type.OBJECT,
              properties: {
                tempC: { type: Type.NUMBER },
                tempF: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                humidity: { type: Type.NUMBER },
                windKmH: { type: Type.NUMBER },
                rainChance: { type: Type.NUMBER },
                packingAdvice: { type: Type.STRING },
                forecast: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      tempMaxC: { type: Type.NUMBER },
                      tempMinC: { type: Type.NUMBER },
                      condition: { type: Type.STRING },
                      icon: { type: Type.STRING },
                    },
                    required: ["day", "tempMaxC", "tempMinC", "condition"],
                  },
                },
              },
              required: ["tempC", "condition", "humidity", "rainChance", "forecast"],
            },
            emergency: {
              type: Type.OBJECT,
              properties: {
                hospitals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      address: { type: Type.STRING },
                      phone: { type: Type.STRING },
                    },
                  },
                },
                police: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      address: { type: Type.STRING },
                      phone: { type: Type.STRING },
                    },
                  },
                },
                embassies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      address: { type: Type.STRING },
                      phone: { type: Type.STRING },
                    },
                  },
                },
                airport: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    code: { type: Type.STRING },
                    distance: { type: Type.STRING },
                  },
                },
                generalEmergencyNumbers: {
                  type: Type.OBJECT,
                  properties: {
                    police: { type: Type.STRING },
                    ambulance: { type: Type.STRING },
                    fire: { type: Type.STRING },
                    touristHelpline: { type: Type.STRING },
                  },
                },
              },
            },
            phrases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  local: { type: Type.STRING },
                  pronunciation: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ["english", "local", "pronunciation", "category"],
              },
            },
            safety: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.NUMBER },
                advisoryLevel: { type: Type.STRING },
                safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                scamsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
                safeNeighborhoods: { type: Type.ARRAY, items: { type: Type.STRING } },
                areasToExerciseCaution: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
        },
      },
    });

    const rawText = response.text || "{}";
    const parsedData = JSON.parse(rawText);

    // Format IDs, Google Map URLs, images, packing list checkboxes
    const coverImage = getDestinationCover(parsedData.destination || destination);

    const tripPlan = {
      id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      destination: parsedData.destination || destination,
      country: parsedData.country || "Destination Region",
      title: parsedData.title || `Unforgettable Trip to ${destination}`,
      summary: parsedData.summary || `A curated ${duration}-day journey in ${destination}.`,
      createdAt: new Date().toISOString(),
      preferences,
      totalBudgetEstimated: parsedData.totalBudgetEstimated || budget,
      currency: parsedData.currency || currency,
      language: parsedData.language || "Local Language",
      bestTimeToVisit: parsedData.bestTimeToVisit || "Spring & Autumn",
      localTransportGuide: parsedData.localTransportGuide || "Metro, buses, and walking are recommended.",
      customsAndEtiquette: parsedData.customsAndEtiquette || ["Tipping is appreciated", "Respect local heritage sites"],
      budgetBreakdown: parsedData.budgetBreakdown || [],
      budgetOptimizationTips: parsedData.budgetOptimizationTips || [],
      hotels: (parsedData.hotels || []).map((h: any, idx: number) => ({
        ...h,
        id: `h_${idx}_${Date.now()}`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + " " + destination)}`,
        image: `https://images.unsplash.com/photo-${1566073771259 + idx * 100}?auto=format&fit=crop&w=600&q=80`,
      })),
      attractions: (parsedData.attractions || []).map((a: any, idx: number) => ({
        ...a,
        id: `attr_${idx}_${Date.now()}`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.name + " " + destination)}`,
        image: `https://images.unsplash.com/photo-${1500000000000 + idx * 12345}?auto=format&fit=crop&w=600&q=80`,
      })),
      restaurants: (parsedData.restaurants || []).map((r: any, idx: number) => ({
        ...r,
        id: `rest_${idx}_${Date.now()}`,
      })),
      dailyItinerary: parsedData.dailyItinerary || [],
      packingList: (parsedData.packingList || []).map((p: any, idx: number) => ({
        id: `pack_${idx}_${Date.now()}`,
        category: p.category || "Essentials",
        item: p.item || "Packing Item",
        checked: false,
        isRequired: p.isRequired ?? true,
      })),
      weather: parsedData.weather || {
        tempC: 22,
        tempF: 71,
        condition: "Partly Cloudy",
        humidity: 60,
        windKmH: 14,
        rainChance: 20,
        packingAdvice: "Light jacket and comfortable shoes recommended.",
        forecast: [
          { day: "Day 1", tempMaxC: 23, tempMinC: 15, condition: "Sunny", icon: "sun" },
          { day: "Day 2", tempMaxC: 22, tempMinC: 14, condition: "Partly Cloudy", icon: "cloud-sun" },
          { day: "Day 3", tempMaxC: 20, tempMinC: 13, condition: "Light Rain", icon: "cloud-rain" },
          { day: "Day 4", tempMaxC: 24, tempMinC: 16, condition: "Sunny", icon: "sun" },
          { day: "Day 5", tempMaxC: 21, tempMinC: 15, condition: "Clear", icon: "sun" },
        ],
      },
      emergency: parsedData.emergency || {
        hospitals: [{ name: `${destination} General Hospital`, address: `Central Avenue, ${destination}`, phone: "+1 555-0199" }],
        police: [{ name: `${destination} Central Police Station`, address: `Main Street, ${destination}`, phone: "+1 555-0112" }],
        embassies: [{ name: "Consular Services Office", address: `Embassy Row, ${destination}`, phone: "+1 555-0100" }],
        airport: { name: `${destination} International Airport`, code: "INT", distance: "25 km" },
        generalEmergencyNumbers: { police: "112", ambulance: "114", fire: "118", touristHelpline: "1800-TRIP" },
      },
      phrases: parsedData.phrases || [
        { english: "Hello / Good Day", local: "Bonjour / Hola", pronunciation: "bon-zhoor", category: "Greetings" },
        { english: "Thank you very much", local: "Merci beaucoup", pronunciation: "mair-see boh-koo", category: "Greetings" },
        { english: "Where is the train station?", local: "Où est la gare?", pronunciation: "oo ay lah gar", category: "Directions" },
        { english: "How much does this cost?", local: "Combien ça coûte?", pronunciation: "kom-byan sah koot", category: "Shopping" },
        { english: "I need help please", local: "Aidez-moi s'il vous plaît", pronunciation: "ay-day mwah seel voo play", category: "Emergency" },
      ],
      safety: parsedData.safety || {
        overallScore: 88,
        advisoryLevel: "Low Risk",
        safetyTips: ["Keep valuables in front pockets in crowded areas.", "Use registered taxis or ride-hailing apps."],
        scamsToAvoid: ["Unsolicited street photographers", "Overpriced unofficial taxi drivers"],
        safeNeighborhoods: ["City Center", "Arts Quarter", "Historic District"],
        areasToExerciseCaution: ["Late night train stations"],
      },
      coverImage,
    };

    res.json(tripPlan);
  } catch (error: any) {
    console.error("Error generating trip:", error);
    res.status(500).json({ error: error?.message || "Failed to generate trip plan" });
  }
});

// API Endpoint: Interactive Travel Assistant Chatbot
app.post("/api/chat-assistant", async (req, res) => {
  try {
    const { tripContext, message, history = [] } = req.body;

    const contextPrompt = tripContext
      ? `You are TripGenius AI Assistant, helping a user who is planning or on a trip to ${tripContext.destination} (${tripContext.country}).
Trip Details:
- Duration: ${tripContext.preferences?.duration || 5} days
- Budget: ${tripContext.currency}${tripContext.totalBudgetEstimated}
- Travel type: ${tripContext.preferences?.travelType}
- Top places: ${tripContext.attractions?.map((a: any) => a.name).join(", ")}
- Best hotels: ${tripContext.hotels?.map((h: any) => h.name).join(", ")}

Answer the user's question accurately, enthusiastically, and practically. Suggest specific local tips, directions, safety, or activity ideas.`
      : `You are TripGenius AI Assistant, a friendly, expert travel consultant. Help the user answer travel questions, choose destinations, figure out packing tips, weather, or budgeting strategies.`;

    const chatHistoryText = history
      .slice(-6)
      .map((m: any) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const fullPrompt = `${chatHistoryText}\nUser: ${message}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: contextPrompt,
      },
    });

    res.json({ text: response.text || "I'm here to help you plan your perfect journey!" });
  } catch (error: any) {
    console.error("Error in AI chat assistant:", error);
    res.status(500).json({ error: "Could not answer right now. Please try again." });
  }
});

// API Endpoint: Compare Two Travel Destinations
app.post("/api/compare-destinations", async (req, res) => {
  try {
    const { dest1, dest2, budget = 1000, duration = 5, travelType = "Solo" } = req.body;

    const systemPrompt = `You are TripGenius AI Travel Comparison Expert.
Compare two travel destinations: "${dest1}" vs "${dest2}" for a ${duration}-day trip with a ${budget} USD budget for ${travelType} travelers.
Analyze estimated cost, travel vibe, best for, weather, pros and cons, and safety score (1-100).
Select a clear winner verdict based on value, experience, and budget fit.
Return JSON strictly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Compare ${dest1} and ${dest2}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dest1: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                country: { type: Type.STRING },
                estCost: { type: Type.NUMBER },
                bestFor: { type: Type.STRING },
                weather: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                safetyScore: { type: Type.NUMBER },
                vibe: { type: Type.STRING },
              },
              required: ["name", "estCost", "bestFor", "weather", "pros", "cons", "safetyScore", "vibe"],
            },
            dest2: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                country: { type: Type.STRING },
                estCost: { type: Type.NUMBER },
                bestFor: { type: Type.STRING },
                weather: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                safetyScore: { type: Type.NUMBER },
                vibe: { type: Type.STRING },
              },
              required: ["name", "estCost", "bestFor", "weather", "pros", "cons", "safetyScore", "vibe"],
            },
            winnerVerdict: { type: Type.STRING },
            comparisonSummary: { type: Type.STRING },
          },
          required: ["dest1", "dest2", "winnerVerdict", "comparisonSummary"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error comparing destinations:", error);
    res.status(500).json({ error: "Failed to compare destinations." });
  }
});

// Vite Development or Production Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TripGenius AI Server running at http://localhost:${PORT}`);
  });
}

startServer();

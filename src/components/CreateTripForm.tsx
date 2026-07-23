import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Car,
  Home,
  Check,
  Zap,
  Bot,
  AlertCircle,
  Clock,
  Coffee,
} from "lucide-react";
import confetti from "canvas-confetti";
import { TripPreferences, TripPlan } from "../types";

interface CreateTripFormProps {
  initialDestination?: string;
  onTripGenerated: (trip: TripPlan) => void;
}

const INTEREST_OPTIONS = [
  { id: "Food", label: "Gourmet Food & Street Eats", icon: "🍱" },
  { id: "Nature", label: "Nature & National Parks", icon: "🌿" },
  { id: "Adventure", label: "Adventure & Hiking", icon: "🧗" },
  { id: "Shopping", label: "Shopping & Markets", icon: "🛍️" },
  { id: "Beaches", label: "Beaches & Coastal Relaxes", icon: "🏖️" },
  { id: "Museums", label: "Museums & Art Galleries", icon: "🖼️" },
  { id: "Nightlife", label: "Nightlife & Music", icon: "🍸" },
  { id: "Historical Places", label: "Historic Monuments & Castles", icon: "🏰" },
  { id: "Wellness", label: "Spa & Wellness", icon: "🧘" },
  { id: "Photography", label: "Scenic Photography Spots", icon: "📸" },
];

export const CreateTripForm: React.FC<CreateTripFormProps> = ({
  initialDestination = "",
  onTripGenerated,
}) => {
  const [destination, setDestination] = useState(initialDestination || "Paris");
  const [budget, setBudget] = useState<number>(1200);
  const [currency, setCurrency] = useState<string>("$");
  const [duration, setDuration] = useState<number>(5);
  const [travelType, setTravelType] = useState<any>("Couple");
  const [transportation, setTransportation] = useState<any>("Flight");
  const [accommodation, setAccommodation] = useState<any>("Hotel");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Food",
    "Museums",
    "Historical Places",
  ]);
  const [dietary, setDietary] = useState<string>("None");
  const [pacing, setPacing] = useState<any>("Balanced");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError("Please enter a destination city or country.");
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1800);

    const preferences: TripPreferences = {
      destination: destination.trim(),
      budget,
      currency,
      duration,
      travelType,
      transportation,
      accommodation,
      interests: selectedInterests,
      dietary: dietary === "None" ? "" : dietary,
      pacing,
      additionalNotes,
    };

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (res.ok && data.id) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        onTripGenerated(data);
      } else {
        setError(data.error || "Trip creation failed. Please try again.");
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setError("Failed to generate trip plan. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-6">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5" /> AI Trip Planner Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Create Your Personalized AI Travel Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Specify your destination, travel preferences, budget, and interests. Our AI will craft an instant full schedule, stay suggestions, and budget breakdown.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading Modal / Screen */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5 shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
              <Bot className="w-10 h-10 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              TripGenius AI is Crafting Your Itinerary...
            </h3>
            <p className="text-xs text-slate-500">
              Analyzing local attractions, hotel ratings, food spots, and optimizing budget for <span className="font-bold text-indigo-600 dark:text-emerald-400">{destination}</span>
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="max-w-md mx-auto space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${loadingStep >= 1 ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                {loadingStep >= 1 ? "✓" : "1"}
              </div>
              <span className={loadingStep >= 1 ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-400"}>
                Analyzing destination weather & safety advisories
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${loadingStep >= 2 ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                {loadingStep >= 2 ? "✓" : "2"}
              </div>
              <span className={loadingStep >= 2 ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-400"}>
                Finding top rated hotels & dining spots matching preferences
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${loadingStep >= 3 ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                {loadingStep >= 3 ? "✓" : "3"}
              </div>
              <span className={loadingStep >= 3 ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-400"}>
                Building day-by-day morning, afternoon & evening schedule
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${loadingStep >= 4 ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                {loadingStep >= 4 ? "✓" : "4"}
              </div>
              <span className={loadingStep >= 4 ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-400"}>
                Generating smart packing checklist & local phrases guide
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* The main Form */
        <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Section 1: Destination & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Destination City or Country
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Paris, Tokyo, Bali, Rome, New York"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  Trip Duration
                </label>
                <span className="text-xs font-extrabold text-indigo-600 dark:text-emerald-400">
                  {duration} Days
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                <span>1 Day</span>
                <span>7 Days</span>
                <span>14 Days</span>
              </div>
            </div>
          </div>

          {/* Section 2: Budget & Currency */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-500" />
                Total Trip Budget
              </label>

              <div className="flex items-center gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="¥">JPY (¥)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="A$">AUD (A$)</option>
                </select>

                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {currency}{budget.toLocaleString()}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={200}
              max={10000}
              step={50}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>{currency}200 (Backpacker)</span>
              <span>{currency}2,500 (Comfortable)</span>
              <span>{currency}10,000+ (Luxury)</span>
            </div>
          </div>

          {/* Section 3: Travel Type & Transportation & Accommodation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Travel Type */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" /> Travel Companion
              </label>
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Solo">Solo Traveler</option>
                <option value="Couple">Couple / Romantic</option>
                <option value="Family">Family with Kids</option>
                <option value="Friends">Group of Friends</option>
                <option value="Business">Business & Pleasure</option>
              </select>
            </div>

            {/* Transportation */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-500" /> Preferred Transport
              </label>
              <select
                value={transportation}
                onChange={(e) => setTransportation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Flight">Flight + Local Transit</option>
                <option value="Train">Scenic Train</option>
                <option value="Car">Car Rental / Road Trip</option>
                <option value="Bus">Budget Bus</option>
              </select>
            </div>

            {/* Accommodation */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-amber-500" /> Accommodation Style
              </label>
              <select
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Hotel">Standard Boutique Hotel</option>
                <option value="Resort">Luxury Resort</option>
                <option value="Hostel">Social Hostel</option>
                <option value="Apartment">Private Apartment / Airbnb</option>
              </select>
            </div>
          </div>

          {/* Section 4: Multi-Select Interests */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Interests & Activities (Select all that apply)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {INTEREST_OPTIONS.map((item) => {
                const selected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 text-xs ${
                      selected
                        ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Pacing & Dietary Constraints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Trip Pacing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Relaxed", "Balanced", "Fast-Paced"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPacing(p)}
                    className={`py-2 px-2 text-xs rounded-xl font-semibold border transition-colors ${
                      pacing === p
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Dietary Preferences / Restrictions
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="None">No Dietary Restrictions</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Halal">Halal</option>
                <option value="Kosher">Kosher</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Special Requests or Custom Preferences (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Prefer quiet boutique hotels, want to visit Disneyland, need wheel-chair accessible routes..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            Generate My Complete AI Trip
          </button>
        </form>
      )}
    </div>
  );
};

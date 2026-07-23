import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  MapPin,
  Share2,
  Printer,
  FileDown,
  Heart,
  Compass,
  Building2,
  Utensils,
  Camera,
  CheckSquare,
  Volume2,
  ShieldAlert,
  Wallet,
  Sparkles,
  ExternalLink,
  Clock,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Sun,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TripPlan, PackingItem, ExpenseItem } from "../types";
import { exportTripToPDF } from "../lib/pdfExport";
import { getExpensesByTrip, saveExpensesForTrip } from "../lib/storage";

interface TripDetailsViewProps {
  trip: TripPlan;
  onToggleFavorite: (tripId: string) => void;
  onOpenAIChat: () => void;
  onBackToDashboard: () => void;
}

export const TripDetailsView: React.FC<TripDetailsViewProps> = ({
  trip,
  onToggleFavorite,
  onOpenAIChat,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "hotels" | "food" | "attractions" | "budget" | "packing" | "language" | "safety" | "expenses"
  >("overview");

  // Local packing items state
  const [packingList, setPackingList] = useState<PackingItem[]>(trip.packingList || []);
  const [newItemText, setNewItemText] = useState("");
  const [newItemCat, setNewItemCat] = useState<PackingItem["category"]>("Essentials");

  // Local expense tracker state
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => getExpensesByTrip(trip.id));
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpAmount, setNewExpAmount] = useState<number | "">("");
  const [newExpCat, setNewExpCat] = useState<ExpenseItem["category"]>("Food");

  // Reservation modal state
  const [selectedHotelBooking, setSelectedHotelBooking] = useState<any | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Copy share link notification
  const [sharedCopied, setSharedCopied] = useState(false);

  // Toggle packing checklist
  const togglePacking = (id: string) => {
    const updated = packingList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setPackingList(updated);
  };

  const addPackingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: PackingItem = {
      id: `p_cust_${Date.now()}`,
      category: newItemCat,
      item: newItemText.trim(),
      checked: false,
      isRequired: false,
    };
    setPackingList([...packingList, newItem]);
    setNewItemText("");
  };

  // Add Expense
  const addExpenseItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !newExpAmount) return;
    const item: ExpenseItem = {
      id: `exp_${Date.now()}`,
      tripId: trip.id,
      title: newExpTitle.trim(),
      amount: Number(newExpAmount),
      category: newExpCat,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    const updated = [item, ...expenses];
    setExpenses(updated);
    saveExpensesForTrip(trip.id, updated);
    setNewExpTitle("");
    setNewExpAmount("");
  };

  const removeExpenseItem = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpensesForTrip(trip.id, updated);
  };

  // TTS audio playback for phrases
  const speakLocalText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy share URL
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSharedCopied(true);
    setTimeout(() => setSharedCopied(false), 2500);
  };

  // Calculations
  const packedCount = packingList.filter((p) => p.checked).length;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = trip.totalBudgetEstimated - totalSpent;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={onBackToDashboard}
          className="font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          {sharedCopied && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
              Link copied to clipboard!
            </span>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
            title="Share Trip"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
            title="Print Itinerary"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => exportTripToPDF(trip)}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${trip.coverImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40"></div>

        <div className="relative z-10 p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <MapPin className="w-4 h-4" />
              {trip.destination}, {trip.country}
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px]">
                {trip.preferences.duration} Days
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[11px]">
                {trip.preferences.travelType}
              </span>
            </div>

            <button
              onClick={() => onToggleFavorite(trip.id)}
              className="p-2.5 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${trip.isFavorite ? "text-rose-500 fill-rose-500" : "text-white"}`} />
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">{trip.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">{trip.summary}</p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-300 block">Estimated Total</span>
                <span className="font-extrabold text-sm text-emerald-400">{trip.currency}{trip.totalBudgetEstimated}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-[10px] text-slate-300 block">Best Season</span>
                <span className="font-bold text-xs text-white">{trip.bestTimeToVisit}</span>
              </div>
            </div>

            <button
              onClick={onOpenAIChat}
              className="ml-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Ask AI Assistant about {trip.destination}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="overflow-x-auto scrollbar-none border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm">
        <div className="flex gap-1 min-w-max">
          {[
            { id: "overview", label: "Overview & Map", icon: Compass },
            { id: "itinerary", label: "Daily Schedule", icon: Calendar },
            { id: "hotels", label: "Hotels & Stays", icon: Building2 },
            { id: "food", label: "Food & Dining", icon: Utensils },
            { id: "attractions", label: "Top Attractions", icon: Camera },
            { id: "budget", label: "Budget Breakdown", icon: DollarSign },
            { id: "packing", label: "Packing Checklist", icon: CheckSquare },
            { id: "language", label: "Local Phrases", icon: Volume2 },
            { id: "safety", label: "Safety & Emergency", icon: ShieldAlert },
            { id: "expenses", label: "Expense Tracker", icon: Wallet },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview & Interactive Map */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Official Language</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{trip.language}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Local Currency</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{trip.currency} (Local Symbol)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Safety Score</span>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{trip.safety.overallScore} / 100 ({trip.safety.advisoryLevel})</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Expected Weather</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{trip.weather.tempC}°C / {trip.weather.condition}</p>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" /> Interactive Google Map – {trip.destination}
              </h3>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.destination)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Open in Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-80 bg-slate-100">
              <iframe
                title={`Map of ${trip.destination}`}
                width="100%"
                height="100%"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(trip.destination)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
              ></iframe>
            </div>
          </div>

          {/* Transportation Guide & Customs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-emerald-400">
                🚌 Local Transport Guide
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {trip.localTransportGuide}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-emerald-400">
                🤝 Local Customs & Etiquette
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-2">
                {trip.customsAndEtiquette.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Daily Itinerary */}
      {activeTab === "itinerary" && (
        <div className="space-y-6 animate-fade-in">
          {trip.dailyItinerary.map((day) => (
            <div
              key={day.dayNumber}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md"
            >
              {/* Day Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 text-emerald-300 font-black text-lg flex items-center justify-center">
                    D{day.dayNumber}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">Day {day.dayNumber}: {day.theme}</h3>
                    <p className="text-[11px] text-indigo-200">Daily Schedule & Highlights</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-indigo-200 uppercase font-bold block">Est. Day Budget</span>
                  <span className="text-sm font-extrabold text-emerald-400">{trip.currency}{day.estimatedDayBudget}</span>
                </div>
              </div>

              {/* Day Slots */}
              <div className="p-5 space-y-4 text-xs">
                {/* Morning */}
                {day.morning && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <Sun className="w-4 h-4" /> Morning ({day.morning.timeSlot || "09:00 AM - 12:00 PM"})
                      </span>
                      {day.morning.cost && (
                        <span className="font-bold text-amber-800 dark:text-amber-300">{day.morning.cost}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{day.morning.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{day.morning.description}</p>
                  </div>
                )}

                {/* Afternoon */}
                {day.afternoon && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Afternoon ({day.afternoon.timeSlot || "01:00 PM - 05:00 PM"})
                      </span>
                      {day.afternoon.cost && (
                        <span className="font-bold text-indigo-800 dark:text-indigo-300">{day.afternoon.cost}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{day.afternoon.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{day.afternoon.description}</p>
                  </div>
                )}

                {/* Evening */}
                {day.evening && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <Utensils className="w-4 h-4" /> Evening ({day.evening.timeSlot || "06:30 PM - 10:00 PM"})
                      </span>
                      {day.evening.cost && (
                        <span className="font-bold text-emerald-800 dark:text-emerald-300">{day.evening.cost}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{day.evening.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{day.evening.description}</p>
                  </div>
                )}

                {/* Daily Tips */}
                {day.dailyTips && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-amber-500 font-bold">💡 Tip:</span>
                    <span>{day.dailyTips}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Hotels & Stays */}
      {activeTab === "hotels" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trip.hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur text-white font-bold text-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {hotel.rating}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{hotel.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {hotel.address}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{hotel.distance}</p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {hotel.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {hotel.amenities.map((a, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nightly Rate</span>
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">{hotel.price}</span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={hotel.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => {
                        setSelectedHotelBooking(hotel);
                        setBookingConfirmed(false);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reservation Simulation Modal */}
          {selectedHotelBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Hotel Booking Reservation</h3>
                  <button
                    onClick={() => setSelectedHotelBooking(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                {bookingConfirmed ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Reservation Hold Confirmed!</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Your provisional booking request for <strong className="text-slate-900 dark:text-white">{selectedHotelBooking.name}</strong> has been secured for {trip.preferences.duration} nights.
                    </p>
                    <button
                      onClick={() => setSelectedHotelBooking(null)}
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedHotelBooking.name}</div>
                      <div className="text-slate-500 mt-0.5">{selectedHotelBooking.address}</div>
                      <div className="font-extrabold text-emerald-600 mt-1">{selectedHotelBooking.price}</div>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold">Guest Name</label>
                      <input
                        type="text"
                        defaultValue="Alex Morgan"
                        className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold">Check-in Date</label>
                      <input
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={() => setBookingConfirmed(true)}
                      className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow mt-2"
                    >
                      Confirm Reservation Hold
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Food & Dining */}
      {activeTab === "food" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trip.restaurants.map((rest) => (
              <div
                key={rest.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                      {rest.mealType}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{rest.priceRange}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{rest.name}</h3>
                  <p className="text-xs text-slate-500">{rest.cuisine}</p>

                  <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs mt-3">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block">Must-Try Dish:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">"{rest.mustTry}"</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{rest.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Attractions */}
      {activeTab === "attractions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {trip.attractions.map((attr) => (
            <div
              key={attr.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img src={attr.image} alt={attr.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold">
                    {attr.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{attr.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{attr.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2">
                    <div>
                      <span className="block font-semibold">Open Hours:</span>
                      <span>{attr.openHours}</span>
                    </div>
                    <div>
                      <span className="block font-semibold">Cost:</span>
                      <span className="text-emerald-600 font-bold">{attr.estimatedCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={attr.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> View Location
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Budget & Smart Optimizer */}
      {activeTab === "budget" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" /> Categorized AI Budget Breakdown
            </h3>

            <div className="space-y-3">
              {trip.budgetBreakdown.map((b) => (
                <div key={b.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{b.category}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {trip.currency}{b.amount} ({b.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                      style={{ width: `${b.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-500">{b.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Budget Optimizer Tips */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-extrabold">Smart AI Budget Optimizer Strategies</h3>
            </div>
            <p className="text-xs text-indigo-200">
              Apply these tailored cost reduction tactics to save up to 25-40% on your trip without compromising experience quality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {trip.budgetOptimizationTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-xs leading-relaxed space-y-1"
                >
                  <span className="font-bold text-amber-300 block">Strategy #{idx + 1}</span>
                  <p className="text-slate-200">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Packing Checklist */}
      {activeTab === "packing" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-500" /> Smart Packing Checklist ({packedCount} / {packingList.length})
              </h3>
              <p className="text-xs text-slate-500">Customized for {trip.destination}'s climate and travel style</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full sm:w-48 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Packed Progress</span>
                <span className="text-indigo-600 dark:text-emerald-400">
                  {Math.round((packedCount / (packingList.length || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(packedCount / (packingList.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Add Item Form */}
          <form onSubmit={addPackingItem} className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add custom item..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <select
              value={newItemCat}
              onChange={(e) => setNewItemCat(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="Essentials">Essentials</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Toiletries">Toiletries</option>
              <option value="Weather Specific">Weather Specific</option>
              <option value="Health">Health</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          {/* Packing Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {packingList.map((item) => (
              <div
                key={item.id}
                onClick={() => togglePacking(item.id)}
                className={`p-3 rounded-2xl border cursor-pointer select-none transition-all flex items-center gap-3 text-xs ${
                  item.checked
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 line-through opacity-75"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-bold ${
                    item.checked
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  }`}
                >
                  {item.checked && "✓"}
                </div>
                <div className="flex-1 truncate">
                  <span className="font-semibold block truncate">{item.item}</span>
                  <span className="text-[10px] text-slate-400">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Local Language Helper */}
      {activeTab === "language" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-indigo-500" /> AI Local Language Helper – {trip.language}
            </h3>
            <p className="text-xs text-slate-500">
              Essential local phrases with phonetic pronunciation and interactive audio speech
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trip.phrases.map((phrase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950">
                    {phrase.category}
                  </span>
                  <button
                    onClick={() => speakLocalText(phrase.local)}
                    className="p-1.5 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-200 transition-colors"
                    title="Audio Pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="font-bold text-slate-900 dark:text-white text-sm">{phrase.english}</div>
                <div className="text-base font-extrabold text-indigo-600 dark:text-emerald-400">{phrase.local}</div>
                <div className="text-[11px] text-slate-500 italic font-medium">Pronunciation: "{phrase.pronunciation}"</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Safety & Emergency */}
      {activeTab === "safety" && (
        <div className="space-y-6 animate-fade-in">
          {/* Safety Gauge */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-black">
                {trip.safety.overallScore}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Travel Advisory: {trip.safety.advisoryLevel}
                </h3>
                <p className="text-xs text-slate-500">Overall Safety Rating Score for {trip.destination}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
                <h4 className="font-bold text-indigo-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Safety Tips
                </h4>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300 pl-2">
                  {trip.safety.safetyTips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                <h4 className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Scams to Avoid
                </h4>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300 pl-2">
                  {trip.safety.scamsToAvoid.map((scam, i) => (
                    <li key={i}>• {scam}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-rose-500" /> Emergency Information & Hotline Numbers
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Police</span>
                <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
                  {trip.emergency.generalEmergencyNumbers.police}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Ambulance</span>
                <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
                  {trip.emergency.generalEmergencyNumbers.ambulance}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Fire Department</span>
                <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
                  {trip.emergency.generalEmergencyNumbers.fire}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Tourist Helpline</span>
                <span className="text-xs font-extrabold text-indigo-600 dark:text-emerald-400">
                  {trip.emergency.generalEmergencyNumbers.touristHelpline}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 10: Expense Tracker */}
      {activeTab === "expenses" && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Planned Budget</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {trip.currency}{trip.totalBudgetEstimated}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Logged Spent</span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {trip.currency}{totalSpent}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Remaining Budget</span>
              <div className={`text-2xl font-black mt-1 ${remainingBudget >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                {trip.currency}{remainingBudget}
              </div>
            </div>
          </div>

          {/* Add Expense Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Log New Expense Item</h3>

            <form onSubmit={addExpenseItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={newExpTitle}
                onChange={(e) => setNewExpTitle(e.target.value)}
                placeholder="Title (e.g. Dinner Bistro)"
                className="px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <input
                type="number"
                required
                value={newExpAmount}
                onChange={(e) => setNewExpAmount(e.target.value ? Number(e.target.value) : "")}
                placeholder="Amount"
                className="px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <select
                value={newExpCat}
                onChange={(e) => setNewExpCat(e.target.value as any)}
                className="px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Hotel">Hotel</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Activities">Activities</option>
                <option value="Other">Other</option>
              </select>

              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Expense
              </button>
            </form>

            {/* Expenses List */}
            <div className="space-y-2 pt-3">
              {expenses.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No logged expenses yet.</p>
              ) : (
                expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{exp.title}</span>
                      <span className="text-[10px] text-slate-400 block">{exp.category} • {exp.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {trip.currency}{exp.amount}
                      </span>
                      <button
                        onClick={() => removeExpenseItem(exp.id)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

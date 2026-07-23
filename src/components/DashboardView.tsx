import React from "react";
import {
  Compass,
  PlusCircle,
  Bookmark,
  Heart,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  Plane,
  Star,
  Users,
} from "lucide-react";
import { TripPlan, User } from "../types";
import { POPULAR_DESTINATIONS, PopularDestination } from "../data/popularDestinations";
import { CurrencyConverterWidget } from "./CurrencyConverterWidget";

interface DashboardViewProps {
  user: User;
  savedTrips: TripPlan[];
  onSelectTrip: (trip: TripPlan) => void;
  onCreateNewTrip: (prefillDestination?: string) => void;
  onOpenAIChat: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  savedTrips,
  onSelectTrip,
  onCreateNewTrip,
  onOpenAIChat,
}) => {
  const favoriteTrips = savedTrips.filter((t) => t.isFavorite);
  const latestTrip = savedTrips[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-indigo-900/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI-Powered Travel Intelligence
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Welcome back, <span className="bg-gradient-to-r from-indigo-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">{user.name.split(" ")[0]}</span>!
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Where would you like to travel next? Let TripGenius AI build your complete itinerary, budget breakdown, packing checklist, and hotel recommendations in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onCreateNewTrip()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Trip Plan
            </button>

            <button
              onClick={onOpenAIChat}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 backdrop-blur flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              Ask AI Travel Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Saved Trips</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{savedTrips.length}</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Ready for departure</p>
        </div>

        {/* Stat 2 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Favorite Places</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{favoriteTrips.length}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Starred itineraries</p>
        </div>

        {/* Stat 3 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Recent Searches</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">12</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">AI search queries</p>
        </div>

        {/* Stat 4 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Trip Budget</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ${savedTrips.length > 0 ? Math.round(savedTrips.reduce((acc, t) => acc + t.totalBudgetEstimated, 0) / savedTrips.length) : 1100}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Optimized by AI</p>
        </div>
      </div>

      {/* Featured / Recent Trip Banner */}
      {latestTrip && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plane className="w-5 h-5 text-indigo-500" /> Active Trip Plan
            </h2>
            <button
              onClick={() => onSelectTrip(latestTrip)}
              className="text-xs font-semibold text-indigo-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View Full Itinerary <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onClick={() => onSelectTrip(latestTrip)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-xl cursor-pointer border border-slate-800 transition-all hover:border-indigo-500/50"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${latestTrip.coverImage})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

            <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <MapPin className="w-4 h-4" />
                  {latestTrip.destination}, {latestTrip.country}
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px]">
                    {latestTrip.preferences.duration} Days
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{latestTrip.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{latestTrip.summary}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Budget</span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {latestTrip.currency}{latestTrip.totalBudgetEstimated}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:bg-emerald-400 transition-colors shadow">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Currency Converter Widget */}
      <CurrencyConverterWidget />

      {/* Popular Destination Inspiration Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-500" /> Explore Popular Destinations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any destination to auto-fill preferences and generate an instant AI plan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onCreateNewTrip(dest.name)}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {dest.rating}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-lg leading-tight">{dest.name}</h3>
                  <p className="text-[11px] text-slate-300 font-medium">{dest.country}</p>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{dest.tagline}</p>

                <div className="flex flex-wrap gap-1">
                  {dest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Suggested</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${dest.suggestedBudget} / {dest.suggestedDays} Days
                    </span>
                  </div>

                  <span className="font-bold text-indigo-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Plan <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

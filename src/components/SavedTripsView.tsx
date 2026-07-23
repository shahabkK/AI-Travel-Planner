import React, { useState } from "react";
import {
  Bookmark,
  Heart,
  Search,
  Trash2,
  Copy,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  PlusCircle,
  Filter,
} from "lucide-react";
import { TripPlan } from "../types";

interface SavedTripsViewProps {
  savedTrips: TripPlan[];
  onSelectTrip: (trip: TripPlan) => void;
  onToggleFavorite: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onDuplicateTrip: (trip: TripPlan) => void;
  onCreateNewTrip: () => void;
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  savedTrips,
  onSelectTrip,
  onToggleFavorite,
  onDeleteTrip,
  onDuplicateTrip,
  onCreateNewTrip,
}) => {
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTrips = savedTrips.filter((trip) => {
    const matchesFilter = filter === "favorites" ? trip.isFavorite : true;
    const matchesSearch =
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-500" /> My Saved Travel Plans
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access, edit, duplicate, or export your saved AI-generated trip itineraries
          </p>
        </div>

        <button
          onClick={onCreateNewTrip}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Create New Trip
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search destination or title..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            All Trips ({savedTrips.length})
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
              filter === "favorites"
                ? "bg-rose-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" /> Favorites (
            {savedTrips.filter((t) => t.isFavorite).length})
          </button>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Saved Trips Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm ? "Try searching for a different destination or keyword." : "You haven't saved any travel plans yet. Create your first AI itinerary!"}
          </p>
          <button
            onClick={onCreateNewTrip}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow"
          >
            Plan a Trip Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={trip.coverImage}
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {/* Favorite toggle */}
                <button
                  onClick={() => onToggleFavorite(trip.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 backdrop-blur hover:bg-slate-900/90 text-white transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      trip.isFavorite ? "text-rose-500 fill-rose-500" : "text-white"
                    }`}
                  />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {trip.destination}, {trip.country}
                  </div>
                  <h3 className="font-extrabold text-lg leading-tight line-clamp-1">{trip.title}</h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{trip.summary}</p>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-500" /> {trip.preferences.duration} Days
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Budget</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> {trip.currency}{trip.totalBudgetEstimated}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Itinerary
                  </button>

                  <button
                    onClick={() => onDuplicateTrip(trip)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Duplicate Trip"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
